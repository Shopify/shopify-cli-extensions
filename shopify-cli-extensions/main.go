package main

import (
	"net/http"
	"os"

	"github.com/Shopify/shopify-cli-extensions/api"
	"github.com/Shopify/shopify-cli-extensions/core"
)

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
	panic("not implemented")
}

func (cli *CLI) create(args ...string) {
	panic("not implemented")
}

func (cli *CLI) serve(args ...string) {
	api := api.NewApi(core.NewExtensionService(cli.config.Extensions))
	mux := http.NewServeMux()
	mux.Handle("/extensions/", http.StripPrefix("/extensions", api))
	http.ListenAndServe(":8000", mux)
}
