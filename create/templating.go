package create

import (
	"embed"
	"fmt"
	"html/template"
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

	fs.WalkDir(t.project, ".", func(path string, d fs.DirEntry, err error) error {
		source := &FileReference{t.project, path, nil, nil}
		target := buildTargetReference(t.extension.Development.RootDir, path)

		if d.IsDir() {
			actions.Add(MakeDir(target.Path))
		} else if isTemplate(path) {
			data, err := fs.ReadFile(t.project, path)
			if err != nil {
				panic(err)
			}
			template.Must(t.New(path).Parse(string(data)))

			actions.Add(RenderTask{
				Source:   source,
				Target:   target,
				Data:     t.extension,
				Template: t.Template,
			})
		} else {
			actions.Add(CopyFileTask{source, target})
		}

		return nil
	})

	if err := actions.Run(); err != nil {
		actions.Undo()
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

func buildTargetReference(parts ...string) *FileReference {
	path := []string{}
	for _, part := range parts {
		if isTemplate(part) {
			part = strings.TrimSuffix(part, ".tpl")
		}
		path = append(path, strings.Split(part, "/")...)
	}
	return &FileReference{os.DirFS("./"), filepath.Join(path...), nil, nil}
}
