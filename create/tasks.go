package create

import (
	"errors"
	"fmt"
	"html/template"
	"io"
	"io/fs"
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

type FileReference struct {
	fs.FS
	path string
}

type RenderTask struct {
	Source FileReference
	Target FileReference
	Data   interface{}
	*template.Template
}

func (t RenderTask) Run() error {
	output, err := os.Create(t.Target.path)
	if err != nil {
		panic(err)
	}
	defer output.Close()

	if err := t.ExecuteTemplate(output, t.Source.path, t.Data); err != nil {
		panic(err)
	}

	return nil
}

func (t RenderTask) Undo() error {
	return nil
}

type CopyFileTask struct {
	Source FileReference
	Target FileReference
}

func (t CopyFileTask) Run() error {
	output, err := os.Create(t.Target.path)
	if err != nil {
		panic(err)
	}
	defer output.Close()

	input, err := t.Source.Open(t.Source.path)
	if err != nil {
		panic(err)
	}
	defer input.Close()

	io.Copy(output, input)

	return nil
}

func (t CopyFileTask) Undo() error {
	return nil
}
