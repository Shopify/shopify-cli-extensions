package build

import (
	"bytes"
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"os"
	"os/exec"
	"path/filepath"
	"sync"

	"github.com/Shopify/shopify-cli-extensions/api"
	"github.com/Shopify/shopify-cli-extensions/core"
	"github.com/Shopify/shopify-cli-extensions/create"
	"github.com/fsnotify/fsnotify"
	"gopkg.in/yaml.v3"

	"text/template"
)

const nextStepsTemplatePath = "templates/%s/next-steps.txt"

func Build(extension core.Extension, report ResultHandler) {
	script, err := script(extension.BuildDir(), "build")
	if err != nil {
		report(Result{false, err.Error(), extension})
		return
	}

	if err := configureScript(script, extension); err != nil {
		report(Result{false, err.Error(), extension})
	}
	ensureBuildDirectoryExists(extension)

	output, err := script.CombinedOutput()
	if err != nil {
		report(Result{false, string(output), extension})
		return
	}

	if err := verifyAssets(extension); err != nil {
		report(Result{false, err.Error(), extension})
		return
	}

	report(Result{true, string(output), extension})
}

func Watch(extension core.Extension, integrationCtx core.IntegrationContext, report ResultHandler) {

	script, err := script(extension.BuildDir(), "develop")
	if err != nil {
		report(Result{false, err.Error(), extension})
		return
	}

	stdout, _ := script.StdoutPipe()
	stderr, _ := script.StderrPipe()

	if err := configureScript(script, extension); err != nil {
		report(Result{false, err.Error(), extension})
	}
	ensureBuildDirectoryExists(extension)

	err = setLocalization(&extension)
	if err != nil {
		report(Result{false, err.Error(), extension})
	}

	go WatchLocalization(&extension)

	script.Start()

	logProcessors := sync.WaitGroup{}
	logProcessors.Add(2)

	templateBytes, _ := create.ReadTemplateFile(fmt.Sprintf(nextStepsTemplatePath, extension.Type))
	nextStepsTemplate := string(templateBytes)

	go processLogs(stdout, logProcessingHandlers{
		onCompletion: func() { logProcessors.Done() },
		onMessage: func(message string) {
			if err := verifyAssets(extension); err != nil {
				report(Result{false, err.Error(), extension})
			} else {
				report(Result{true, message, extension})
				if len(nextStepsTemplate) > 0 {
					fmt.Fprintf(os.Stdout, "%s\n", generateNextSteps(nextStepsTemplate, extension, integrationCtx))
					nextStepsTemplate = ""
				}
			}
		},
	})

	go processLogs(stderr, logProcessingHandlers{
		onCompletion: func() { logProcessors.Done() },
		onMessage: func(message string) {
			report(Result{false, message, extension})
		},
	})

	script.Wait()
	logProcessors.Wait()

}

// Builds 'Next Steps'
func generateNextSteps(rawTemplate string, ext core.Extension, ctx core.IntegrationContext) string {
	type contextRoot struct { // Wraps top-level elements, allowing them to be referenced in next-steps.txt
		core.Extension
		core.IntegrationContext
	}

	var buf bytes.Buffer

	templ := template.New("templ")
	templ, err := templ.Parse(rawTemplate)
	if err == nil {
		contextRoot := &contextRoot{ext, ctx}
		templ.Execute(&buf, contextRoot)
	}

	return buf.String()
}

type ResultHandler func(result Result)

func ensureBuildDirectoryExists(ext core.Extension) {
	if _, err := os.Stat(ext.BuildDir()); errors.Is(err, os.ErrNotExist) {
		os.MkdirAll(ext.BuildDir(), rwxr_xr_x)
	}
}

func configureScript(script *exec.Cmd, extension core.Extension) error {
	data, err := yaml.Marshal(extension)
	if err != nil {
		return fmt.Errorf("unable to serialize extension configuration information: %w", err)
	}
	script.Stdin = bytes.NewReader(data)
	return nil
}

const rwxr_xr_x = 0755

func setLocalization(extension *core.Extension) error {
	//HACK: for debugging / output to console, related to: (https://github.com/Shopify/checkout-web/issues/9581)
	fmt.Println("setLocalization() called...")
	localization, err := api.GetLocalization(extension)

	if err != nil {
		log.Println(err)
		return err
	}
	extension.Localization = localization

	//HACK: for debugging / output to console, related to: (https://github.com/Shopify/checkout-web/issues/9581)
	jsonBytes, err := json.Marshal(extension)
	if err != nil {
		log.Fatalln(err)
	}
	fmt.Println(string(jsonBytes))

	return nil
}

func WatchLocalization(extension *core.Extension) {

	watcher, err := fsnotify.NewWatcher()
	if err != nil {
		log.Fatal(err)
	}
	defer watcher.Close()

	done := make(chan bool)
	go func() {
		for {
			select {
			case event, ok := <-watcher.Events:
				if !ok {
					return
				}

				const t = true
				triggers := map[string]bool{fsnotify.Create.String(): t, fsnotify.Rename.String(): t, fsnotify.Write.String(): t}

				if triggers[event.Op.String()] {
					setLocalization(extension)
					if err != nil {
						log.Println("could not resolve localization, error:", err.Error())
					}
				}
			case err, ok := <-watcher.Errors:
				if !ok {
					return
				}
				log.Println("error:", err)
			}
		}
	}()

	directory := filepath.Join(".", extension.Development.RootDir, "locales")
	err = watcher.Add(directory)
	log.Println("Watcher added for:", directory)
	if err != nil {
		log.Fatal(err)
	}
	<-done
}
