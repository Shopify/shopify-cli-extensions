---
extension_points:
  - Checkout::Feature::Render
metafields:
  - namespace: my-namespace
    key: my-key
  - namespace: my-namespace
    key: my-key
some_list:
  - list_element_1a
    list_element_1b
  - list_element_3
{{end}}
{{merge "projects/checkout_ui_extension/extension.config.yml.tpl"}}