{{- if .Development.UsesReact -}}
{{ template "shared/checkout_ui_extension/react.js.tpl" }}
{{- else -}}
{{ template "shared/checkout_ui_extension/javascript.js.tpl" }}
{{- end -}}
