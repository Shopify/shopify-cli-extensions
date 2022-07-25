{{- if .Development.UsesReact -}}
{{ template "shared/customer_account_ui_extension/react.js" . }}
{{- else -}}
{{ template "shared/customer_account_ui_extension/javascript.js" . }}
{{- end -}}
