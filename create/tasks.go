package create

import (
	"errors"
	"fmt"
	"os/exec"

	"github.com/Shopify/shopify-cli-extensions/core/fsutils"
	"github.com/Shopify/shopify-cli-extensions/create/process"
)

func makeDir(path string) process.Task {
	return process.Task{
		Run: func() error {
			return fsutils.MakeDir(path)
		},
		Undo: func() error {
			return fsutils.RemoveDir(path)
		},
	}
}

func installDependencies(path string) process.Task {
	return process.Task{
		Run: func() error {
			var package_manager string
			if yarn, err := LookPath("yarn"); err == nil {
				package_manager = yarn
			} else if npm, err := LookPath("npm"); err == nil {
				package_manager = npm
			} else {
				return errors.New("package manager not found")
			}

			cmd := Command(path, package_manager)
			output, err := cmd.CombinedOutput()

			if err != nil {
				return fmt.Errorf("failed to install dependencies: %s", output)
			}
			return nil
		},
		Undo: func() error {
			// TODO: Skip if directory doesn't exist
			cmd := exec.Command("rm", "-rf", "node_modules")
			cmd.Dir = path
			if err := cmd.Run(); err != nil {
				return err
			}

			return nil
		},
	}
}
