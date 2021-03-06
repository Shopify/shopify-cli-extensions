{
  "name": "{{.Type}}",
  "license": "MIT",
  "dependencies": {
    {{- with .Development}}
    {{ if .UsesReact }}"{{ .Renderer.Name }}-react": "{{ raw .Renderer.Version }}",{{ end }}
    {{ if .UsesReact }}"react": "^17.0.0",{{ else }}"{{ .Renderer.Name }}": "{{ raw .Renderer.Version }}",{{ end }}
    {{- end }}
    "graphql": "^15.5.1",
    "graphql-tag": "^2.12.4",
    "@apollo/client": "^3.4.8"
  },
  "devDependencies": {
    {{ if .Development.UsesTypeScript }}"typescript": "^4.1.0",{{ end }}
    "@shopify/shopify-cli-extensions": "latest"
  },
  "scripts": {
    "build": "shopify-cli-extensions build",
    "develop": "shopify-cli-extensions develop"
  }
}
