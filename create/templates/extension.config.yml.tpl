---
development:
  entries:
    {{- range $key, $value := .Development.Entries}}
    {{$key}}: "{{$value}}"
    {{- end}}
