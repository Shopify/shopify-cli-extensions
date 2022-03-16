{
    "name": "{{ .Type }}",
    "license": "MIT",
    "dependencies": {
      {{ if .React }}"{{ .Development.Renderer.Name }}-react": "{{ raw .Development.Renderer.Version }}",{{ end }}
      {{ if .React }}"react": "^17.0.0"{{ else }}"{{ .Development.Renderer.Name }}": "{{ raw .Development.Renderer.Version }}"{{ end }}
    },
    "devDependencies": {
      {{ if .TypeScript }}"typescript": "^4.1.0",{{ end }}
      {{ if .TypeScript }}"@typescript-eslint/eslint-plugin": "^4.15.0",{{ end }}
      {{ if .TypeScript }}"@typescript-eslint/parser": "^4.15.0",{{ end }}
      {{ if .React }}"eslint-plugin-react": "^7.22.0",{{ end }}
      "@shopify/shopify-cli-extensions": "latest",
      "eslint": "^7.19.0",
      "eslint-config-prettier": "^7.2.0",
      "eslint-plugin-prettier": "^3.3.0",
    },
    "scripts": {
      "build": "shopify-cli-extensions build",
      "develop": "shopify-cli-extensions develop"
    }
  }
