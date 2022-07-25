import React from 'react';
import {render, Banner} from '@shopify/customer-account-ui-extensions-react';

render('CustomerAccount::Returns::FullPage::RenderWithin', () => <App />);

function App() {
  return <Banner>Welcome</Banner>;
}
