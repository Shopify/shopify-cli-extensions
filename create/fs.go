package create

import (
	"fmt"
	"io"
	"io/fs"
	"os"
	"strings"
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
		return walk(NewSourceFileReference(_fs.FS, path), err)
	})
}

type WalkDirFunc func(ref *SourceFileReference, err error) error

func NewSourceFileReference(fs fs.FS, path string) *SourceFileReference {
	return &SourceFileReference{fs, path, nil}
}

type SourceFileReference struct {
	fs.FS
	Path string
	file io.ReadCloser
}

func (r *SourceFileReference) IsDir() bool {
	fileInfo, err := fs.Stat(r.FS, r.Path)
	if err != nil {
		panic(err)
	}
	return fileInfo.IsDir()
}

func (r *SourceFileReference) IsTemplate() bool {
	return !r.IsDir() && strings.HasSuffix(r.Path, ".tpl")
}

func (r *SourceFileReference) Read(p []byte) (int, error) {
	if r.file == nil {
		file, err := r.FS.Open(r.Path)
		if err != nil {
			return 0, err
		}
		r.file = file
	}

	n, err := r.file.Read(p)
	if err == io.EOF {
		r.file.Close()
	}

	return n, err
}

func NewTargetFileReference(fs fs.FS, path string) *TargetFileReference {
	return &TargetFileReference{fs, path, nil}
}

type TargetFileReference struct {
	fs.FS
	Path string
	file io.WriteCloser
}

func (r *TargetFileReference) Open() (err error) {
	r.file, err = os.Create(r.Path)
	return
}

func (r *TargetFileReference) Close() error {
	return r.file.Close()
}

func (r *TargetFileReference) Write(p []byte) (int, error) {
	if r.file == nil {
		return 0, fmt.Errorf("file not opened")
	}

	return r.file.Write(p)
}
