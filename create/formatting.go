package create

import (
	"bytes"
	"encoding/json"

	"gopkg.in/yaml.v3"
)

func formatJSON(input []byte) ([]byte, error) {
	var data map[string]interface{}

	if err := json.Unmarshal(input, &data); err != nil {
		return nil, err
	}

	var output bytes.Buffer
	encoder := json.NewEncoder(&output)
	encoder.SetEscapeHTML(false)
	encoder.SetIndent("", "  ")
	if err := encoder.Encode(data); err != nil {
		return nil, err
	}

	return output.Bytes(), nil
}

func formatYaml(input []byte, targetPath string) ([]byte, error) {
	var data map[interface{}]interface{}
	if err := yaml.Unmarshal(input, &data); err != nil {
		return nil, err
	}

	var output bytes.Buffer
	output.Write([]byte("---\n"))

	encoder := yaml.NewEncoder(&output)
	encoder.SetIndent(2)
	encoder.Encode(&data)

	return output.Bytes(), nil
}
