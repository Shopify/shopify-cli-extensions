{{- if .Development.UsesReact -}}
{{ template "shared/checkout_post_purchase/react.js.tpl" }}
{{- else -}}
{{ template "shared/checkout_post_purchase/javascript.js.tpl" }}
{{- end -}}
