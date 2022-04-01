package create

import (
	"fmt"
	"io"
	"io/fs"
	"os"
	"path"
	"path/filepath"
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
		if err != nil {
			return fmt.Errorf("unable to traverse file system: %w", err)
		}

		return walk(NewSourceFileReference(_fs.FS, path))
	})
}

type WalkDirFunc func(ref *SourceFileReference) error

func NewSourceFileReference(fs fs.FS, path ...string) *SourceFileReference {
	return &SourceFileReference{fs, UniversalPath(path...), nil}
}

type SourceFileReference struct {
	fs.FS
	universalPath
	file io.ReadCloser
}

func (r *SourceFileReference) IsDir() bool {
	fileInfo, err := fs.Stat(r.FS, r.Path())
	if err != nil {
		panic(err)
	}
	return fileInfo.IsDir()
}

func (r *SourceFileReference) IsTemplate() bool {
	return !r.IsDir() && strings.HasSuffix(r.Path(), ".tpl")
}

func (r *SourceFileReference) Read(p []byte) (int, error) {
	if r.file == nil {
		file, err := r.FS.Open(r.Path())
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

func (r *SourceFileReference) InferTarget(projectDir string) *TargetFileReference {
	targetPath := r.Path()

	if r.IsTemplate() {
		targetPath = strings.TrimSuffix(targetPath, ".tpl")
	}

	return NewTargetFileReference(os.DirFS("."), projectDir, targetPath)
}

func NewTargetFileReference(fs fs.FS, path ...string) *TargetFileReference {
	return &TargetFileReference{fs, UniversalPath(path...), nil}
}

type TargetFileReference struct {
	fs.FS
	universalPath
	file io.WriteCloser
}

func (r *TargetFileReference) Open() (err error) {
	r.file, err = os.Create(r.FilePath())
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

func UniversalPath(chunks ...string) universalPath {
	return universalPath(chunks)
}

type universalPath []string

func (p universalPath) Path() string {
	return path.Join(p.Fragments()...)
}

func (p universalPath) FilePath() string {
	return filepath.Join(p.Fragments()...)
}

func (p universalPath) Fragments() []string {
	fragments := make([]string, 0)
	for _, fragment := range p {
		fragments = append(fragments, strings.Split(fragment, "/")...)
	}
	return fragments
}
