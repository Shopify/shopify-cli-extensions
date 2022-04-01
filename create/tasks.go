package create

import (
	"embed"
	"errors"
	"fmt"
	"html/template"
	"io"
	"io/fs"
	"os"
	"os/exec"
	"path"

	"github.com/Shopify/shopify-cli-extensions/core"
)

//go:embed templates/*
var templates embed.FS

type CreateProject core.Extension

func (e CreateProject) Run() error {
	extension := core.Extension(e)
	shared, _ := fs.Sub(templates, "templates/shared")
	project, _ := fs.Sub(templates, path.Join("templates/projects", extension.Type))

	engine := NewTemplateEngine(extension, FS{shared}, FS{project})
	engine.createProject()

	return nil
}

func (ext CreateProject) Undo() error {
	return nil
}

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

type RenderTask struct {
	Source *SourceFileReference
	Target *TargetFileReference
	Data   interface{}
	*template.Template
}

func (t RenderTask) Run() error {
	if err := t.Target.Open(); err != nil {
		return err
	}
	defer t.Target.Close()

	if err := t.ExecuteTemplate(t.Target, t.Source.Path(), t.Data); err != nil {
		return err
	}

	return nil
}

func (t RenderTask) Undo() error {
	return nil
}

type CopyFileTask struct {
	Source *SourceFileReference
	Target *TargetFileReference
}

func (t CopyFileTask) Run() error {
	if err := t.Target.Open(); err != nil {
		return err
	}
	defer t.Target.Close()

	if _, err := io.Copy(t.Target, t.Source); err != nil {
		return err
	}

	return nil
}

func (t CopyFileTask) Undo() error {
	return nil
}
