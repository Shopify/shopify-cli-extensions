package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"sync"

	"github.com/Shopify/shopify-cli-extensions/api"
	"github.com/Shopify/shopify-cli-extensions/build"
	"github.com/Shopify/shopify-cli-extensions/core"
	"github.com/Shopify/shopify-cli-extensions/create"
)

var ctx context.Context

func init() {
	ctx = context.Background()
}

func main() {
	config, err := core.LoadConfig(os.Stdin)
	if err != nil {
		panic(err)
	}

	cmd, args := os.Args[1], os.Args[2:]
	cli := CLI{config}

	switch cmd {
	case "build":
		cli.build(args...)
	case "create":
		cli.create(args...)
	case "serve":
		cli.serve(args...)
	}
}

type CLI struct {
	config *core.Config
}

func (cli *CLI) build(args ...string) {
	api := api.New(cli.config)

	var wg sync.WaitGroup
	build_chan := make(chan build.Result)

	errors := 0
	for _, e := range cli.config.Extensions {
		b := build.NewBuilder(e)

		wg.Add(1)
		go b.Build(ctx, func(result build.Result) {
			defer wg.Done()
			build_chan <- result

			if !result.Success {
				errors++
				log.Printf("[Build] Error: %s, Extension: %s", result.Error, result.UUID)
			} else {
				log.Printf("[Build] Success! Extension: %s", result.UUID)
			}
		})

		go cli.monitor(wg, build_chan, "Build", api, e)
	}

	wg.Wait()

	if errors > 0 {
		os.Exit(1)
	} else {
		os.Exit(0)
	}
}

func (cli *CLI) create(args ...string) {
	extension := cli.config.Extensions[0]
	err := create.NewExtensionProject(extension)
	if err != nil {
		panic(fmt.Errorf("failed to create a new extension: %w", err))
	}
}

func (cli *CLI) serve(args ...string) {
	log.Printf("Shopify CLI Extensions Server is now available at http://localhost:%d/", cli.config.Port)
	api := api.New(cli.config)

	var wg sync.WaitGroup

	develop_chan := make(chan build.Result)
	watch_chan := make(chan build.Result)

	for _, e := range cli.config.Extensions {
		b := build.NewBuilder(e)

		wg.Add(1)
		go b.Develop(ctx, func(result build.Result) {
			develop_chan <- result
		})

		go cli.monitor(wg, develop_chan, "Develop", api, e)

		go b.Watch(ctx, func(result build.Result) {
			watch_chan <- result
		})

		go cli.monitor(wg, watch_chan, "Watch", api, e)
	}

	addr := fmt.Sprintf(":%d", cli.config.Port)
	if err := http.ListenAndServe(addr, api); err != nil {
		panic(err)
	}

	wg.Wait()
}

func (cli *CLI) monitor(wg sync.WaitGroup, ch chan build.Result, action string, a *api.ExtensionsApi, e core.Extension) {
	defer wg.Done()

	for result := range ch {
		if result.Success {
			log.Printf("[%s] event for extension: %s", action, result.UUID)
			go a.Notify(api.StatusUpdate{Type: "success", Extensions: []core.Extension{e}})
		} else {
			log.Printf("[%s] error for extension %s, error: %s", action, result.UUID, result.Error.Error())
			go a.Notify(api.StatusUpdate{Type: "error", Extensions: []core.Extension{e}})
		}
	}
}
