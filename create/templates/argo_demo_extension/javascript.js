import {Text, extend} from '@shopify/admin-ui-extensions';

extend('Playground', App);

function App(root, {extensionPoint}) {
  root.appendChild(root.createComponent(Text, {}, `Welcome to the ${extensionPoint} extension!`));
  root.mount();
}
