package core

import (
	"io"

	"gopkg.in/yaml.v3"
)

func NewExtensionService(config *Config, apiRoot string) *ExtensionService {
	for index := range config.Extensions {
		config.Extensions[index].Assets = make(map[string]Asset)
	}

	service := ExtensionService{
		App:        make(App),
		Version:    "0.1.0",
		Extensions: config.Extensions,
		Port:       config.Port,
		Store:      config.Store,
	}

	return &service
}

func LoadConfig(r io.Reader) (config *Config, err error) {
	config = &Config{}
	decoder := yaml.NewDecoder(r)
	err = decoder.Decode(config)
	return
}

type Config struct {
	App        App         `json:"app" yaml:"-"`
	Extensions []Extension `yaml:"extensions"`
	Port       int
	PublicUrl  string `yaml:"public_url"`
	Store      string
}

type ExtensionService struct {
	App        App `json:"app" yaml:"-"`
	Extensions []Extension
	Port       int
	Store      string
	Version    string
}

type Extension struct {
	Type        string           `json:"type" yaml:"type"`
	UUID        string           `json:"uuid" yaml:"uuid"`
	Assets      map[string]Asset `json:"assets" yaml:"-"`
	Development Development      `json:"development" yaml:"development"`
	User        User             `json:"user" yaml:"user"`
	Version     string           `json:"version" yaml:"version"`
}

type Asset struct {
	Name string `json:"name" yaml:"name"`
	Url  string `json:"url" yaml:"url"`
}

type Development struct {
	Root     Url               `json:"root"`
	Resource Url               `json:"resource"`
	Renderer Renderer          `json:"-" yaml:"renderer"`
	Hidden   bool              `json:"hidden"`
	Focused  bool              `json:"focused"`
	BuildDir string            `json:"-" yaml:"build_dir"`
	RootDir  string            `json:"-" yaml:"root_dir"`
	Template string            `json:"-"`
	Entries  map[string]string `json:"-"`
}

type Renderer struct {
	Name    string `json:"name"`
	Version string `json:"version"`
}

type User struct {
	Metafields []Metafield `json:"metafields" yaml:"metafields"`
}

type Metafield struct {
	Namespace string `json:"namespace" yaml:"namespace"`
	Key       string `json:"key" yaml:"key"`
}

type App map[string]interface{}

type Url struct {
	Url string `json:"url" yaml:"url"`
}
