import React from 'react';
import {render, extend, Text} from '@shopify/admin-ui-extensions-react';

extend(
  'Playground',
  render(() => <App />),
);

function App({extensionPoint}) {
  return <Text>Welcome to the {extensionPoint} extension!</Text>;
}
