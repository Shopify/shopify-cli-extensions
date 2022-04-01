package create

import (
	"bytes"
	"fmt"
	"html/template"
	"io"
	"io/fs"
	"reflect"
	"strings"

	"github.com/Shopify/shopify-cli-extensions/core"
	"github.com/imdario/mergo"
	"gopkg.in/yaml.v3"
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
			actions.Add(MakeDir(target.Path()))
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

func (t *templateEngine) register(source *SourceFileReference) error {
	return t.registerAs(source.Path(), source)
}

func (t *templateEngine) registerAs(name string, source *SourceFileReference) error {
	data, err := io.ReadAll(source)
	if err != nil {
		return err
	}

	_, err = t.New(name).Parse(string(data))
	return err
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
		"merge": func(paths ...string) string {
			fragments := make([]core.Fragment, 0, len(paths))

			for _, path := range paths {
				buffer := bytes.Buffer{}
				t.ExecuteTemplate(&buffer, path, extension)

				fragment := make(core.Fragment)
				yaml.Unmarshal(buffer.Bytes(), fragment)
				fragments = append(fragments, fragment)
			}

			mergeFn := func(fragments ...core.Fragment) core.Fragment {
				result := fragments[0]
				for _, fragment := range fragments[1:] {
					err := mergo.Merge(&result, &fragment, mergo.WithAppendSlice)
					if err != nil {
						fmt.Println(err)
					}
				}
				return result
			}
			result := mergeFn(fragments...)

			deduplicateFn := func(merged core.Fragment) core.Fragment {
				deduped := make(core.Fragment)
				for key, value := range merged {
					if reflect.TypeOf(value) != reflect.TypeOf([]interface{}{}) {
						deduped[key] = value
						continue
					}
					// assert: value is a slice

					src := value.([]interface{})
					dst := make([]interface{}, 0, len(src))

					if reflect.TypeOf(src[0]) == reflect.TypeOf(map[string]interface{}{}) {
						/*
						 * Assertion - value is a slice of maps
						 * O(n^2) approach used with inner maps because Go maps
						 * are not comparable and thus cannot act as key values
						 */
					outer:
						for _, srcMap := range src {
							for _, dstMap := range dst {
								if reflect.DeepEqual(srcMap, dstMap) {
									continue outer
								}
							}
							dst = append(dst, srcMap)
						}
					} else {
						// Assertion - value is a slice (but not a slice of maps)
						set := map[interface{}]struct{}{}
						for _, l := range src {
							if _, exists := set[l]; !exists {
								set[l] = struct{}{}
								dst = append(dst, l)
							}
						}
					}
					deduped[key] = dst
				}
				return deduped
			}
			result = deduplicateFn(result)

			serializedResult, _ := yaml.Marshal(result)
			return strings.TrimSpace(string(serializedResult))
		},
	}
}
