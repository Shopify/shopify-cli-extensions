package create

import (
	"fmt"
	"html/template"
	"io"
	"io/fs"
	"os"
	"path/filepath"
	"strings"

	"github.com/Shopify/shopify-cli-extensions/core"
)

func NewTemplateEngine(extension core.Extension, shared, project FS) *templateEngine {
	template := template.Must(template.New("").Parse(""))
	template.Funcs(buildTemplateHelpers(extension, shared))
	engine := &templateEngine{extension, project, template}

	shared.WalkDir(func(source *FileReference, err error) error {
		if err != nil {
			return err
		}

		if source.IsDir() {
			return nil
		}

		if err := engine.registerAs("shared/"+source.Path, source); err != nil {
			return fmt.Errorf("failed to parse template %s: %w", source, err)
		}

		return nil
	})

	return engine
}

type templateEngine struct {
	Extension core.Extension
	project   FS
	*template.Template
}

func (t *templateEngine) createProject() {
	actions := NewProcess()

	t.project.WalkDir(func(source *FileReference, err error) error {
		if err != nil {
			return err
		}

		target := buildTargetReference(t.Extension.Development.RootDir, source.Path)

		if source.IsDir() {
			actions.Add(MakeDir(target.Path))
		} else if source.IsTemplate() {
			t.register(source)

			actions.Add(RenderTask{
				Source:   source,
				Target:   target,
				Data:     t.Extension,
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

func (t *templateEngine) register(source *FileReference) error {
	return t.registerAs(source.Path, source)
}

func (t *templateEngine) registerAs(name string, source *FileReference) error {
	data, err := io.ReadAll(source)
	if err != nil {
		return err
	}

	_, err = t.New(name).Parse(string(data))
	return err
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
