{{- template "shared/shopify.ui.extension.toml" . }}

extension_points = [
  'CustomerAccount::Returns::FullPage::RenderWithin',
  # 'CustomerAccount::Subscriptions::FullPage::RenderWithin'
]
