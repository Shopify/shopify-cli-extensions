package create

import (
	"html/template"
	"testing"

	"github.com/Shopify/shopify-cli-extensions/core"
)

func Test_mergeYaml(t *testing.T) {
	template := template.Must(template.New("").Parse(""))
	funcMap := buildTemplateHelpers(template, core.Extension{}, FS{})

}