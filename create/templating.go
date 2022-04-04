package create

import (
	"fmt"
	"html/template"
	"io"
	"io/fs"
	"strings"

	"github.com/Shopify/shopify-cli-extensions/core"
)

func NewTemplateEngine(extension core.Extension, shared, project FS) *templateEngine {
	template := template.Must(template.New("").Parse(""))
	template.Funcs(buildTemplateHelpers(template, extension, shared))
	engine := &templateEngine{extension, project, template}

	shared.WalkDir(func(source *SourceFileReference) error {
		if source.IsDir() {
			return nil
		}

		if err := engine.registerAs("shared/"+source.Path(), source); err != nil {
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

	t.project.WalkDir(func(source *SourceFileReference) error {
		target := source.InferTarget(t.Extension.Development.RootDir)

		if source.IsDir() {
			actions.Add(MakeDir(target.FilePath()))
		} else if source.IsTemplate() {
			t.register(source)

			actions.Add(RenderTask{
				Source:    source,
				Target:    target,
				Extension: t.Extension,
				Template:  t.Template,
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

func (t *templateEngine) register(source *SourceFileReference) error {
	return t.registerAs(source.Path(), source)
}

func (t *templateEngine) registerAs(name string, source *SourceFileReference) error {
	return source.Open(func(r io.Reader) error {
		data, err := io.ReadAll(r)
		if err != nil {
			return err
		}

		_, err = t.New(name).Parse(string(data))
		return err
	})
}

func buildTemplateHelpers(t *template.Template, extension core.Extension, shared fs.FS) template.FuncMap {
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
