package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"

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
	build_errors := 0
	active_builders := len(cli.config.Extensions)

	for _, e := range cli.config.Extensions {
		b := build.NewBuilder(e)
		log.Printf("Building %s, id: %s", e.Type, e.UUID)

		ch := make(chan build.Result)

		go b.Build(ctx, func(result build.Result) {
			ch <- result
		})

		for result := range ch {
			active_builders--

			if result.Success {
				log.Printf("Extension %s built successfully!", result.UUID)
			} else {
				build_errors += 1
				log.Printf("Extension %s failed to build: %s", result.UUID, result.Error.Error())
			}

			if active_builders == 0 {
				close(ch)
			}
		}
	}

	switch {
	case build_errors == 1:
		log.Println("There was an error during build, please check your logs for more information.")
		os.Exit(1)
	case build_errors > 1:
		log.Printf("There were %d errors during build, please check your logs for more information.", build_errors)
		os.Exit(1)
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
	fmt.Println("Shopify CLI Extensions Server is now available at http://localhost:8000/")

	api := api.New(cli.config)

	var active_watchers int
	var active_builders int

	watcher_monitor := make(chan build.Result)
	builder_monitor := make(chan build.Result)

	for _, e := range cli.config.Extensions {
		go cli.develop(e, active_builders, builder_monitor)
		go cli.watch(e, active_watchers, watcher_monitor)
	}

	http.ListenAndServe(":8000", api)

	<-watcher_monitor
	<-builder_monitor
}

func (cli *CLI) develop(e core.Extension, active_builders int, ch chan build.Result) {
	b := build.NewBuilder(e)
	log.Printf("Run develop for extension %s", e.UUID)
	go b.Develop(ctx, func(result build.Result) {
		ch <- result
	})

	for result := range ch {
		active_builders--

		if result.Success {
			log.Printf("Successfully running develop for extension %s", result.UUID)
		} else {
			log.Printf("Failed to run develop for extension %s, error: %s", result.UUID, result.Error.Error())
		}
	}

	if active_builders == 0 {
		close(ch)
	}
}

func (cli *CLI) watch(e core.Extension, active_watchers int, ch chan build.Result) {
	b := build.NewBuilder(e)
	log.Printf("Watching extension %s", e.UUID)
	go b.Watch(ctx, func(result build.Result) {
		ch <- result
	})

	for result := range ch {
		active_watchers--

		if result.Success {
			log.Printf("Watching extension %s...", result.UUID)
		} else {
			log.Printf("Error watching extension %s, error: %s", result.UUID, result.Error.Error())
		}
	}

	if active_watchers == 0 {
		close(ch)
	}
}
