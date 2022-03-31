package create

import (
	"os/exec"

	"github.com/Shopify/shopify-cli-extensions/core"
)

func NewExtensionProject(extension core.Extension) error {
	setup := NewProcess(
		MakeDir(extension.Development.RootDir),
		CreateProject(extension),
		InstallDependencies(extension.Development.RootDir),
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
