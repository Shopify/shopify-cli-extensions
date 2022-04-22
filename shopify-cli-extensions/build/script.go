package build

import (
	"errors"
	"os/exec"
)

var (
	LookPath = exec.LookPath
	Command  = exec.Command
)

func script(dir, nodeExecutable string, script string, args ...string) (*exec.Cmd, error) {
	if nodeExecutable != "" {
		cmd := Command(nodeExecutable, append([]string{script}, args...)...)
		cmd.Dir = dir
		return cmd, nil
	} else if exe, err := LookPath("yarn"); err == nil {
		cmd := Command(exe, buildYarnArguments(script, args...)...)
		cmd.Dir = dir
		return cmd, nil
	} else if exe, err := LookPath("npm"); err == nil {
		cmd := Command(exe, buildNpmArguments(script, args...)...)
		cmd.Dir = dir
		return cmd, nil
	} else {
		return nil, errors.New("package manager not found")
	}
}

func buildYarnArguments(script string, args ...string) []string {
	return append([]string{"run", "--silent", script}, args...)
}

func buildNpmArguments(script string, args ...string) []string {
	return append([]string{"run", "--silent", script, "--"}, args...)
}
