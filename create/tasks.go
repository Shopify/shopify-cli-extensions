package create

import (
	"errors"
	"fmt"
	"os"
	"os/exec"
)

// MakeDir is a process.Task that creates a directory.
type MakeDir string

func (path MakeDir) Run() error {
	return os.MkdirAll(string(path), 0755)
}

func (path MakeDir) Undo() error {
	return os.Remove(string(path))
}

// InstallDependencies is a process.Task for installing the JavaScript packages required
// by an extension. It's automatically choose which package manager to use.
type InstallDependencies string

func (path InstallDependencies) Run() error {
	var package_manager string
	if yarn, err := LookPath("yarn"); err == nil {
		package_manager = yarn
	} else if npm, err := LookPath("npm"); err == nil {
		package_manager = npm
	} else {
		return errors.New("package manager not found")
	}

	cmd := Command(string(path), package_manager)
	output, err := cmd.CombinedOutput()

	if err != nil {
		return fmt.Errorf("failed to install dependencies: %s", output)
	}
	return nil
}

func (path InstallDependencies) Undo() error {
	// TODO: Skip if directory doesn't exist
	cmd := exec.Command("rm", "-rf", "node_modules")
	cmd.Dir = string(path)
	if err := cmd.Run(); err != nil {
		return err
	}

	return nil
}
