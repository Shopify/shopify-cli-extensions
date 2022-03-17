/* global module */
module.exports = {
  plugins: [{{ if .React }}'react', {{ end }}{{ if .TypeScript }}'@typescript-eslint', {{ end }}'prettier'],
  {{ if .TypeScript }}parser: '@typescript-eslint/parser',{{ end }}
  extends: [
    'eslint:recommended',
    {{ if .React }}'plugin:react/recommended',{{ end }}
    {{ if .TypeScript }}'plugin:@typescript-eslint/recommended',{{ end }}
    {{ if .TypeScript }}'prettier/@typescript-eslint',{{ end }}
    'plugin:prettier/recommended',
  ],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    ecmaFeatures: {
      {{ if .React }}jsx: true,{{ end }}
    },
  },
  settings: {
    {{ if .React }}react: {
      version: '17.0',
    },{{ end }}
  },
  rules: {
    {{ if .React }}'react/react-in-jsx-scope': 'off',{{ end }}
    {{ if .TypeScript }}'@typescript-eslint/explicit-module-boundary-types': 'off',{{ end }}
  },
  ignorePatterns: ['build/*'],
};
