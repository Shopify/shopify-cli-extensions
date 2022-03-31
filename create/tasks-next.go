package create

import (
	"embed"
	"fmt"
	"html/template"
	"io"
	"io/fs"
	"os"
	"path"
	"path/filepath"
	"strings"

	"github.com/Shopify/shopify-cli-extensions/core"
	"github.com/Shopify/shopify-cli-extensions/create/process"
)

//go:embed templates/*
var templates embed.FS

func createProject(extension core.Extension) process.Task {
	shared, _ := fs.Sub(templates, "templates/shared")
	project, _ := fs.Sub(templates, path.Join("templates/projects", extension.Type))

	engine := newTemplateEngine(extension, shared, project)

	return process.Task{
		Run: func() error {
			engine.createProject()
			return nil
		},
		Undo: func() error {
			engine.deleteProject()
			return nil
		},
	}
}

func newTemplateEngine(extension core.Extension, shared, project fs.FS) *templateEngine {
	template := template.Must(template.New("").Parse(""))
	template.Funcs(buildTemplateHelpers(extension))

	fs.WalkDir(shared, ".", func(path string, d fs.DirEntry, err error) error {
		if !d.IsDir() {
			data, err := fs.ReadFile(shared, path)
			if err != nil {
				panic(fmt.Errorf("failed to read file %s: %w", path, err))
			}

			if _, err := template.New("shared/" + path).Parse(string(data)); err != nil {
				panic(fmt.Errorf("failed to parse template %s: %w", path, err))
			}
		}

		return nil
	})

	return &templateEngine{
		extension,
		project,
		template,
	}
}

type templateEngine struct {
	extension core.Extension
	project   fs.FS
	*template.Template
}

func (t *templateEngine) createProject() {
	actions := process.NewProcess()

	fs.WalkDir(t.project, ".", func(source string, d fs.DirEntry, err error) error {
		target := buildTargetPath(t.extension.Development.RootDir, source)

		if d.IsDir() {
			actions.Add(makeDir(target))
		} else if isTemplate(source) {
			actions.Add(t.makeRenderTask(source, target))
		} else {
			actions.Add(t.makeCopyTask(source, target))
		}

		return nil
	})

	if err := actions.Run(); err != nil {
		actions.Undo()
	}
}

func (t *templateEngine) deleteProject() {

}

func (t *templateEngine) makeRenderTask(source, target string) process.Task {
	return process.Task{
		Run: func() error {
			output, err := os.Create(target)
			if err != nil {
				panic(err)
			}
			defer output.Close()

			t.ParseFS(t.project, source)
			if err := t.Execute(output, t.extension); err != nil {
				panic(err)
			}

			return nil
		},
		Undo: func() error {
			return nil
		},
	}
}

func (t *templateEngine) makeCopyTask(source, target string) process.Task {
	return process.Task{
		Run: func() error {
			output, err := os.Create(target)
			if err != nil {
				panic(err)
			}
			defer output.Close()

			input, err := t.project.Open(source)
			if err != nil {
				panic(err)
			}
			defer input.Close()

			io.Copy(output, input)

			return nil
		},
		Undo: func() error {
			return nil
		},
	}
}

func buildTemplateHelpers(extension core.Extension) template.FuncMap {
	return template.FuncMap{
		"raw": func(value string) template.HTML {
			return template.HTML(value)
		},
	}
}

func isTemplate(path string) bool {
	return filepath.Ext(path) == ".tpl"
}

func buildTargetPath(parts ...string) string {
	path := []string{}
	for _, part := range parts {
		if isTemplate(part) {
			part = strings.TrimSuffix(part, ".tpl")
		}
		path = append(path, strings.Split(part, "/")...)
	}
	return filepath.Join(path...)
}
