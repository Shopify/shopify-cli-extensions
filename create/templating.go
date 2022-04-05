package create

import (
	"bytes"
	"encoding/json"
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
		"merge": func(paths ...string) template.HTML {
			if len(paths) == 0 {
				return ""
			}

			isYaml := func(path string) bool {
				return strings.HasSuffix(path, ".yml") || strings.HasSuffix(path, ".yaml") ||
				strings.HasSuffix(path, ".yml.tpl") || strings.HasSuffix(path, ".yaml.tpl")
			}
			isJson := func(path string) bool {
				return strings.HasSuffix(path, ".json") || strings.HasSuffix(path, ".json.tpl")
			}

			makeFragments := func (paths ...string) []core.Fragment {
				fragments := make([]core.Fragment, 0, len(paths))
				for _, path := range paths {
					buffer := bytes.Buffer{}
					t.ExecuteTemplate(&buffer, path, extension)

					if isYaml(path) {
						fragment := core.Fragment{}
						yaml.Unmarshal(buffer.Bytes(), fragment)
						fragments = append(fragments, fragment)
					} else if isJson(path) {
						jsonFragment := core.JsonFragment{}
						json.Unmarshal(buffer.Bytes(), &jsonFragment.Fragment)
						fragments = append(fragments, jsonFragment.Fragment)
					}
				}
				return fragments
			}

			merge := func (fragments ...core.Fragment) core.Fragment {
				merged := fragments[0]
				for _, fragment := range fragments[1:] {
					err := mergo.Merge(&merged, &fragment, mergo.WithAppendSlice)
					if err != nil {
						fmt.Println(err)
					}
				}
				return merged
			}

			deduplicate := func(merged core.Fragment) core.Fragment {
				deduped := make(core.Fragment)
				for key, value := range merged {
					if reflect.TypeOf(value) != reflect.TypeOf([]interface{}{}) {
						deduped[key] = value
						continue
					}
					// assert: value is a slice

					src := value.([]interface{})
					dst := make([]interface{}, 0, len(src))

				outer:
					for _, srcElmt := range src {
						for _, dstElmt := range dst {
							if reflect.DeepEqual(srcElmt, dstElmt) {
								continue outer
							}
						}
						dst = append(dst, srcElmt)
					}
					deduped[key] = dst
				}
				return deduped
			}
			
			fragments := makeFragments(paths...)
			merged := merge(fragments...)
			resultFragment := deduplicate(merged)

			var serializedResult []byte
			if isYaml(paths[0]) {
				serializedResult, _ = yaml.Marshal(resultFragment)
			} else if isJson(paths[0]) {
				serializedResult, _ = json.MarshalIndent(resultFragment, "", "  ")
			}
			return template.HTML(strings.TrimSpace(string(serializedResult)))
		},
		"upcase": strings.ToUpper,
	}
}
