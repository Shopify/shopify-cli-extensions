{{- if .Development.UsesReact -}}
{{ file "shared/checkout_ui_extension/react.js.tpl" }}
{{- else -}}
{{ file "shared/checkout_ui_extension/javascript.js.tpl" }}
{{- end -}}
