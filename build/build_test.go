package build

import (
	"fmt"
	"os"
	"path/filepath"
	"testing"

	"github.com/Shopify/shopify-cli-extensions/core"
)

var config *core.Config

func init() {
	configFile, err := os.Open("testdata/extension.config.yml")
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

func TestBuild(t *testing.T) {
	extension := config.Extensions[0]

	err := os.RemoveAll(extension.BuildDir())
	if err != nil {
		t.Fatal(err)
	}

	Build(extension, func(result Result) {
		if !result.Success {
			t.Error("expected extension to build successfully")
			t.Error(result.Message)
		}
	})

	if _, err = os.Stat(filepath.Join(extension.BuildDir(), "main.js")); err != nil {
		t.Error("expected main.js to exist")
	}

	if _, err = os.Stat(filepath.Join(extension.BuildDir(), "main.js.LEGAL.txt")); err != nil {
		t.Error("expected main.js.LEGAL.txt to exist")
	}
}

func TestWatch(t *testing.T) {
	extension := config.Extensions[0]

	err := os.Remove(filepath.Join(extension.BuildDir(), "main.js"))
	if err != nil {
		t.Fatal(err)
	}

	results := []Result{}
	Watch(extension, config.IntegrationContext, func(result Result) {
		results = append(results, result)
	})

	if len(results) != 2 {
		t.Fatal("expected 2 results")
	}

	if results[0].Success {
		t.Error("expected first build to fail")
	}

	if !results[1].Success {
		t.Error("expected second build to succeed")
	}

	if _, err = os.Stat(filepath.Join(extension.BuildDir(), "main.js")); err != nil {
		t.Error("expected main.js to exist")
	}
}

func TestWatchLocalization(t *testing.T) {
	extension := config.Extensions[0]
	locales_filepath := filepath.Join(".", extension.Development.RootDir, "locales")

	println("Test 01")

	os.RemoveAll(locales_filepath)
	err := os.Mkdir(locales_filepath, 0775)
	if err != nil {
		t.Fatal(err)
	}

	// err := os.Remove(filepath.Join(extension.BuildDir(), "main.js"))
	// if err != nil {
	// 	t.Fatal(err)
	// }

	results := []Result{}
	go WatchLocalization(extension, func(result Result) {
		results = append(results, result)
	})

	println("Test 02")

	// d1 := []byte("hello\ngo\n")
	en_content := []byte("{\"key\":\"value\"}")
	os.WriteFile(filepath.Join(locales_filepath, "en.default.json"), en_content, 0775)

	println("Test 03")
	println(len(results))

	if len(results) != 1 {
		t.Error("expected 1 result1")
	}

	println("Test 04")

	if results[0].Success {
		t.Error("expected first build to succeed")
	}

	println("Test 05")

	os.RemoveAll(locales_filepath)

	println("Test End")

	// if !results[1].Success {
	// 	t.Error("expected second build to succeed")
	// }

	// if _, err = os.Stat(filepath.Join(extension.BuildDir(), "main.js")); err != nil {
	// 	t.Error("expected main.js to exist")
	// }
}
