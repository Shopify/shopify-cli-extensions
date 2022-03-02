package build

import (
	"bytes"
	"errors"
	"fmt"
	"os"
	"os/exec"
	"strings"
	"sync"

	"github.com/Shopify/shopify-cli-extensions/core"
	"github.com/Shopify/shopify-cli-extensions/create"
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
					fmt.Fprintf(os.Stdout, "%s\n", evaluateTemplate(nextStepsTemplate, extension, integrationCtx))
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

func evaluateTemplate(rawTemplate string, ext core.Extension, ctx core.IntegrationContext) string {
	type contextRoot struct {
		core.Extension
		core.IntegrationContext
		BundleUrls []string
	}

	var buf bytes.Buffer

	templ := template.New("templ")
	templ, err := templ.Parse(rawTemplate)
	if err == nil {
		bundleUrls := buildBundleUrls(ext, ctx)
		contextRoot := &contextRoot{ ext, ctx, bundleUrls }
		templ.Execute(&buf, contextRoot)
	}

	return buf.String()
}

func buildBundleUrls(ext core.Extension, ctx core.IntegrationContext) []string {
	bundleUrls := []string{}
	for _, entryMain := range ext.Development.Entries {
		pathComponents := strings.Split(entryMain, "/")
		lastIndex := len(pathComponents) - 1
		var entrypoint string
		if lastIndex >= 0 {
			entrypoint = pathComponents[lastIndex]
		}
		bundleUrls = append(bundleUrls, fmt.Sprintf("%s/extensions/%s/assets/%s", ctx.PublicUrl, ext.UUID, entrypoint))
	}
	return bundleUrls
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
