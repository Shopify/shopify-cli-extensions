package create

import (
	"os/exec"

	"github.com/Shopify/shopify-cli-extensions/core"
	"github.com/Shopify/shopify-cli-extensions/core/fsutils"
)

func ReadTemplateFile(path string) ([]byte, error) {
	return fsutils.NewFS(&templates, "templates").ReadTemplateFile(path)
}

func NewExtensionProject(extension core.Extension) error {
	tasks := []Task{
		MakeDir(extension.Development.RootDir),
		CreateProject(extension),
	}

	if extension.Development.InstallDependencies == nil || *extension.Development.InstallDependencies {
		tasks = append(tasks, InstallDependencies(extension.Development.RootDir))
	}

	setup := NewProcess(
		tasks...,
	)

	return setup.Run()
}

var LookPath = exec.LookPath
var Command = func(dir, executable string, args ...string) (runner Runner) {
	cmd := exec.Command(executable, args...)
	cmd.Dir = dir
	return cmd
}

type Runner interface {
	Run() error
	CombinedOutput() ([]byte, error)
}
