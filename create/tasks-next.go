package create

import (
	"bytes"
	"embed"
	"fmt"
	"html/template"
	"io"
	"io/fs"
	"os"
	"path"
	"path/filepath"
	"reflect"
	"strings"

	"github.com/Shopify/shopify-cli-extensions/core"
	"github.com/Shopify/shopify-cli-extensions/create/process"
	"github.com/imdario/mergo"
	"gopkg.in/yaml.v3"
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
	template.Funcs(buildTemplateHelpers(template, extension, shared))

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

func (t *templateEngine) deleteProject() {

}

func (t *templateEngine) makeRenderTask(source, target string) process.Task {
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

	return process.Task{
		Run: func() error {
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
			fragments := make([]fragment, 0, len(paths))

			for _, path := range paths {
				buffer := bytes.Buffer{}
				t.ExecuteTemplate(&buffer, path, "TODO")

				fragment := make(fragment)
				yaml.Unmarshal(buffer.Bytes(), fragment)
				fragments = append(fragments, fragment)
			}

			mergeFn := func (fragments ...fragment) fragment {
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

			deduplicateFn := func(merged fragment) fragment {
				deduped := make(fragment)
				for key, value := range merged {
					if reflect.TypeOf(value) != reflect.TypeOf([]interface{}{}) {
						deduped[key] = value
						continue
					}
					// assert: value is a slice

					src := value.([]interface{})
					dst := make([]interface{}, 0, len(src))

					if (reflect.TypeOf(src[0]) == reflect.TypeOf(map[string]interface{}{})) {
						// assert: value is a slice of maps
						// O(n^2) approach used because maps are not comparable and cannot act as key values
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
						set := map[interface{}]struct{}{}
						for _, l := range src { 
							if _, exists := set[l]; !exists {
								set[l]= struct{}{}
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

type fragment = map[interface{}]interface{}

type fragmentTransformer struct {}

func (ft fragmentTransformer) Transformer(typ reflect.Type) func(dst, src reflect.Value) error {
	if typ == reflect.TypeOf(fragment{}) {
		return func(dst, src reflect.Value) error {
			srcFragment, ok := src.Interface().(fragment)
			if (!ok) {
				return nil
			}
			dstFragment, ok := dst.Interface().(fragment)
			if (!ok) {
				return nil
			}

			for srcKey, srcValue := range srcFragment {
				if reflect.TypeOf(srcValue) != reflect.TypeOf([]interface{}{}) {
					return nil	// src value is not a list
				}
				srcList, ok := reflect.ValueOf(srcValue).Interface().([]interface{})
				if !ok {
					return nil
				} else if len(srcList) == 0 {
					return nil
				}

				dstValue, dstContainsValue := dstFragment[srcKey]
				if reflect.TypeOf(dstValue) != reflect.TypeOf(srcValue){
					return nil
				}

				dstList, ok := reflect.ValueOf(dstValue).Interface().([]interface{})
				if !ok || reflect.TypeOf(srcList) != reflect.TypeOf(dstList){
					return nil
				}

				if (reflect.TypeOf(srcList[0]) == reflect.TypeOf(map[string]interface{}{})) {
					// value is a list of maps
					if dstContainsValue {
						outer:
						for _, m := range srcList {
							srcMap, ok := reflect.ValueOf(m).Interface().(map[string]interface{})
							if !ok {
								return nil
							}
							for _, m := range dstList {
								dstMap, ok := reflect.ValueOf(m).Interface().(map[string]interface{})
								if !ok {
									return nil
								}
								if reflect.DeepEqual(srcMap, dstMap) {
									continue outer
								}
							}
							dstList = append(dstList, srcMap)
						}
						dstFragment[srcKey] = dstList
					}
				} else {
					// value is a list
					if dstContainsValue {
						dstSet := map[interface{}]struct{}{}
						for _, l := range dstList {
							if _, exists := dstSet[l]; !exists {
								dstSet[l]= struct{}{}
							}
						}
						for _, l := range srcList {
							if _, exists := dstSet[l]; !exists {
								dstList = append(dstList, l)
							}
						}
						dstFragment[srcKey] = dstList
					}
				}
			}
			return nil
		}
	}
	return nil
}