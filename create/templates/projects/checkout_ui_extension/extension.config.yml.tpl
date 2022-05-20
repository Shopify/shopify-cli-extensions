---
name: App Feature
extension_points:
  - Checkout::Dynamic::Render
development:
  build:
    env:
      CUSTOM_VAR: foo
  develop:
    env:
      CUSTOM_VAR: bar
# metafields:
#   - namespace: my-namespace
#     key: my-key
#   - namespace: my-namespace
#     key: my-key-2
