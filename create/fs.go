package create

import (
	"fmt"
	"io"
	"io/fs"
	"os"
)

type Person struct {
	Name string
	Age  int
}

type FS struct {
	fs.FS
}

func (_fs FS) WalkDir(walk WalkDirFunc) error {
	return fs.WalkDir(_fs.FS, ".", func(path string, d fs.DirEntry, err error) error {
		return walk(NewFileReference(_fs.FS, path), d, err)
	})
}

type WalkDirFunc func(ref *FileReference, d fs.DirEntry, err error) error

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
