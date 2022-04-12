import React from "react";
{{- if .Development.UsesNext -}}
import { render, extend, Text } from "@shopify/app/ui-extensions/admin/react";
{{- else -}}
import { render, extend, Text } from "@shopify/admin-ui-extensions-react";
{{- end -}}

// Your extension must render all four modes
extend("Admin::Product::SubscriptionPlan::Add", render(App));
extend("Admin::Product::SubscriptionPlan::Create", render(App));
extend("Admin::Product::SubscriptionPlan::Remove", render(App));
extend("Admin::Product::SubscriptionPlan::Edit", render(App));

function App({ extensionPoint }) {
  return <Text>Welcome to the {extensionPoint} extension!</Text>;
}
