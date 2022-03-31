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

func NewFileReference(fs fs.FS, path string) *FileReference {
	return &FileReference{fs, path, nil, nil}
}

type FileReference struct {
	fs.FS
	Path   string
	output io.WriteCloser
	input  io.ReadCloser
}

func (r *FileReference) Open() (err error) {
	r.output, err = os.Create(r.Path)
	return
}

func (r *FileReference) Close() error {
	return r.output.Close()
}

func (r *FileReference) Read(p []byte) (int, error) {
	if r.input == nil {
		file, err := r.FS.Open(r.Path)
		if err != nil {
			return 0, err
		}
		r.input = file
	}

	n, err := r.input.Read(p)
	if err == io.EOF {
		r.input.Close()
	}

	return n, err
}

func (r *FileReference) Write(p []byte) (int, error) {
	if r.output == nil {
		return 0, fmt.Errorf("file not opened")
	}

	return r.output.Write(p)
}

type RenderTask struct {
	Source *FileReference
	Target *FileReference
	Data   interface{}
	*template.Template
}

func (t RenderTask) Run() error {
	if err := t.Target.Open(); err != nil {
		return err
	}
	defer t.Target.Close()

	if err := t.ExecuteTemplate(t.Target, t.Source.Path, t.Data); err != nil {
		return err
	}

	return nil
}

func (t RenderTask) Undo() error {
	return nil
}

type CopyFileTask struct {
	Source *FileReference
	Target *FileReference
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
