{{define "merge-test-0.yml.tpl"}}
simple_key_1: incorrect-simple-value
simple_key_2: incorrect-simple-value
simple_key_4: incorrect-simple-value-4
some_list:
  - list-element-1a
    list-element-1b
  - list-element-2
some_maps:
  - key: value-1
    namespace: namespace-1
  - key: value-2
    namespace: namespace-2
{{end}}
{{merge "merge-test-0.yml.tpl" "merge-test-1.yml" "merge-test-2.yml"}}