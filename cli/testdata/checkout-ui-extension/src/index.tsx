import {
  render,
  TextField,
  TextBlock,
  BlockStack,
} from '@shopify/checkout-ui-extensions-react';

render('Checkout::Feature::Render', ({extensionPoint}) => (
  <App extensionPoint={extensionPoint} />
));

function App({extensionPoint}: {extensionPoint: string}) {
  return (
    <BlockStack>
      <TextBlock>Welcome to the {extensionPoint} extension!</TextBlock>
      <TextBlock>My custom environment variable is: {process.env.SOME_VAR}</TextBlock>
      <TextBlock>My custom NODE_ENV is: {process.env.NODE_ENV}</TextBlock>
      <TextField
        label="Order note"
        onChange={(value) => {
          // eslint-disable-next-line no-console
          console.log(`Updated order note: ${value}`);
        }}
      />
    </BlockStack>
  );
}
