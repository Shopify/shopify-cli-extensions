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

	engine := newTemplateEngine(extension, FS{shared}, FS{project})
	engine.createProject()

	return nil
}

func (ext CreateProject) Undo() error {
	return nil
}

func newTemplateEngine(extension core.Extension, shared, project FS) *templateEngine {
	template := template.Must(template.New("").Parse(""))
	template.Funcs(buildTemplateHelpers(extension, shared))

	shared.WalkDir(func(source *FileReference, err error) error {
		if err != nil {
			return err
		}

		if !source.IsDir() {
			data, err := io.ReadAll(source)
			if err != nil {
				return fmt.Errorf("failed to read file %s: %w", source, err)
			}

			if _, err := template.New("shared/" + source.Path).Parse(string(data)); err != nil {
				panic(fmt.Errorf("failed to parse template %s: %w", source, err))
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
	project   FS
	*template.Template
}

func (t *templateEngine) createProject() {
	actions := NewProcess()

	t.project.WalkDir(func(source *FileReference, err error) error {
		if err != nil {
			return err
		}

		target := buildTargetReference(t.extension.Development.RootDir, source.Path)

		if source.IsDir() {
			actions.Add(MakeDir(target.Path))
		} else if source.IsTemplate() {
			data, err := io.ReadAll(source)
			if err != nil {
				return fmt.Errorf("failed to read template %s: %w", source, err)
			}
			template.Must(t.New(source.Path).Parse(string(data)))

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

func buildTargetReference(parts ...string) *FileReference {
	path := []string{}
	for _, part := range parts {
		if isTemplate(part) {
			part = strings.TrimSuffix(part, ".tpl")
		}
		path = append(path, strings.Split(part, "/")...)
	}
	return NewFileReference(os.DirFS("."), filepath.Join(path...))
}

func isTemplate(path string) bool {
	return filepath.Ext(path) == ".tpl"
}
