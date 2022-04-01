{{define "projects/checkout_ui_extension/extension.config.yml.tpl"}}
---
single_key: single_value
single_key3: single_value3
extension_points:
  - ExtensionPoint1
    ExtensionPoint1a
  - ExtensionPoint2
metafields:
  - namespace: MetaNS1
    key: MetaKey1
  - namespace: MetaNS3
    key: MetaKey3
{{end}}
{{merge "projects/checkout_ui_extension/extension.config.yml.tpl" "shared/checkout_ui_extension/extension.config.yml"}}