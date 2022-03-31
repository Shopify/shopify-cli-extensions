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
)

//go:embed templates/*
var templates embed.FS

type CreateProject core.Extension

func (e CreateProject) Run() error {
	extension := core.Extension(e)
	shared, _ := fs.Sub(templates, "templates/shared")
	project, _ := fs.Sub(templates, path.Join("templates/projects", extension.Type))

	engine := newTemplateEngine(extension, shared, project)
	engine.createProject()

	return nil
}

func (ext CreateProject) Undo() error {
	return nil
}

func newTemplateEngine(extension core.Extension, shared, project fs.FS) *templateEngine {
	template := template.Must(template.New("").Parse(""))
	template.Funcs(buildTemplateHelpers(extension, shared))

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
	actions := NewProcess()

	fs.WalkDir(t.project, ".", func(source string, d fs.DirEntry, err error) error {
		target := buildTargetPath(t.extension.Development.RootDir, source)

		if d.IsDir() {
			actions.Add(MakeDir(target))
		} else if isTemplate(source) {
			data, err := fs.ReadFile(t.project, source)
			if err != nil {
				panic(err)
			}
			template.Must(t.New(source).Parse(string(data)))
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

func (t *templateEngine) makeRenderTask(source, target string) Task {
	confirm := func(source, target string) (string, string) {
		if source == "src/index.js.tpl" && t.extension.Development.UsesTypeScript() {
			ext := ".ts"
			if t.extension.Development.UsesReact() {
				ext = ".tsx"
			}
			return source, strings.TrimSuffix(target, ".js") + ext
		} else {
			return source, target
		}
	}

	return DynamicTask{
		OnRun: func() error {
			source, target = confirm(source, target)
			if target == "" {
				return nil
			}

			output, err := os.Create(target)
			if err != nil {
				panic(err)
			}
			defer output.Close()

			if err := t.ExecuteTemplate(output, source, t.extension); err != nil {
				panic(err)
			}

			return nil
		},
		OnUndo: func() error {
			return nil
		},
	}
}

func (t *templateEngine) makeCopyTask(source, target string) Task {
	return DynamicTask{
		OnRun: func() error {
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
		OnUndo: func() error {
			return nil
		},
	}
}

func buildTemplateHelpers(extension core.Extension, shared fs.FS) template.FuncMap {
	return template.FuncMap{
		"raw": func(value string) template.HTML {
			return template.HTML(value)
		},
		"file": func(name string) template.HTML {
			data, err := fs.ReadFile(shared, strings.TrimPrefix(name, "shared/"))
			if err != nil {
				panic(err)
			}
			return template.HTML(string(data))
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
