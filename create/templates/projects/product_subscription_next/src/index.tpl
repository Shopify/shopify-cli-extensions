{{- if .Development.UsesReact -}}
{{ template "shared/product_subscription/react.js.tpl" }}
{{- else -}}
{{ template "shared/product_subscription/javascript.js.tpl" }}
{{- end -}}
