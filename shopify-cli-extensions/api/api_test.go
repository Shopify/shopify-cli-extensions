package api

import (
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httptest"
	"os"
	"testing"

	"github.com/Shopify/shopify-cli-extensions/core"
)

var (
	config *core.Config
)

func init() {
	configFile, err := os.Open("testdata/shopifile.yml")
	if err != nil {
		panic(fmt.Errorf("unable to open file: %w", err))
	}
	defer configFile.Close()

	config, err = core.LoadConfig(configFile)
	if err != nil {
		panic(fmt.Errorf("unable to load config: %w", err))
	}

	if len(config.Extensions) < 1 {
		panic("tests won't run without extensions")
	}
}

func TestGetExtensions(t *testing.T) {
	req, err := http.NewRequest("GET", "/extensions/", nil)
	if err != nil {
		t.Fatal(err)
	}
	rec := httptest.NewRecorder()

	api := New(config)
	api.ServeHTTP(rec, req)

	if rec.Code != http.StatusOK {
		t.Errorf("Expected ok status – received: %d", rec.Code)
	}

	service := core.ExtensionService{}
	if err := json.Unmarshal(rec.Body.Bytes(), &service); err != nil {
		t.Logf("%+v\n", rec.Body.String())
		t.Fatal(err)
	}

	t.Logf("%+v\n", service)

	if len(service.Extensions) != 1 {
		t.Errorf("Expected one extension got %d", len(service.Extensions))
	}

	extension := service.Extensions[0]

	if extension.Assets == nil {
		t.Error("Expected assets to not be null")
	}

	if extension.App == nil {
		t.Error("Expected app to not be null")
	}

	if extension.User.Metafields == nil {
		t.Error("Expected user metafields to not be null")
	}
}

func TestServeAssets(t *testing.T) {
	req, err := http.NewRequest("GET", "/extensions/00000000-0000-0000-0000-000000000000/assets/index.js", nil)
	if err != nil {
		t.Fatal(err)
	}
	rec := httptest.NewRecorder()

	api := New(config)
	api.ServeHTTP(rec, req)

	if rec.Body.String() != "console.log(\"Hello World!\");\n" {
		t.Error("Unexpected body")
		t.Log(rec.Body)
	}
}
