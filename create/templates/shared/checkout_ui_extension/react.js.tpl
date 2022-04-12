import React from 'react';
{{- if .Development.UsesNext }}
import {useExtensionApi, render, Text} from '@shopify/app/ui-extensions/checkout/react';
{{- else }}
import {useExtensionApi, render, Text} from '@shopify/checkout-ui-extensions-react';
{{ end }}
render('Checkout::Dynamic::Render', () => <App />);

function App() {
  const {extensionPoint, i18n} = useExtensionApi();
  return <Text>{i18n.translate('welcome', {extensionPoint})}</Text>;
}
