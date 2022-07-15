import { extend, Banner } from "@shopify/customer-account-ui-extensions";

extend('CustomerAccount::Returns::FullPage::RenderWithin', (root) => {
  root.appendChild(
    root.createComponent(
      Banner,
      {},
      'Welcome'
    )
  );
  root.mount();
});
