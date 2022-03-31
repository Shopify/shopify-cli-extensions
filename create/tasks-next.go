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
	files := make(map[string]string)

	fs.WalkDir(t.project, ".", func(source string, d fs.DirEntry, err error) error {
		target := filepath.Join(append(strings.Split(
			t.extension.Development.RootDir, "/"),
			strings.Split(source, "/")...)...,
		)

		if d.IsDir() {
			if err := os.Mkdir(target, 0755); err != nil && !os.IsExist(err) {
				panic(err)
			}
		} else {
			data, err := fs.ReadFile(t.project, source)
			if err != nil {
				panic(err)
			}

			if path.Ext(source) == ".tpl" {
				template.Must(t.New(source).Parse(string(data)))
			}
			files[source] = target
		}

		return nil
	})

	for source, target := range files {
		output, err := os.Create(target)
		if err != nil {
			panic(err)
		}
		defer output.Close()

		if path.Ext(source) == ".tpl" {
			if err := t.ExecuteTemplate(output, source, t.extension); err != nil {
				panic(err)
			}
		} else {
			input, err := t.project.Open(source)
			if err != nil {
				panic(err)
			}
			defer input.Close()

			io.Copy(output, input)
		}
	}
}

func (t *templateEngine) deleteProject() {

}

func buildTemplateHelpers(extension core.Extension) template.FuncMap {
	return template.FuncMap{
		"raw": func(value string) template.HTML {
			return template.HTML(value)
		},
	}
}
