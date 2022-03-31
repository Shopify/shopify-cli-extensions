package create

import (
	"embed"
	"io/fs"
	"os"
	"path"
	"path/filepath"
	"strings"
	"text/template"

	"github.com/Shopify/shopify-cli-extensions/core"
	"github.com/Shopify/shopify-cli-extensions/create/process"
)

//go:embed templates/* templates/.shopify-cli.yml.tpl
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
	template := template.Template{}
	template.Funcs(buildTemplateHelpers(extension))

	fs.WalkDir(shared, ".", func(path string, d fs.DirEntry, err error) error {
		if !d.IsDir() {
			data, _ := fs.ReadFile(shared, path)
			template.New("shared/" + path).Parse(string(data))
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
	template.Template
}

func (t *templateEngine) createProject() {
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

			t.New(source)
			if _, err := t.Parse(string(data)); err != nil {
				panic(err)
			}

			file, err := os.Create(target)
			if err != nil {
				panic(err)
			}
			defer file.Close()

			if err := t.Execute(file, t.extension); err != nil {
				panic(err)
			}
		}

		return nil
	})
}

func (t *templateEngine) deleteProject() {

}

func buildTemplateHelpers(extension core.Extension) template.FuncMap {
	return template.FuncMap{}
}
