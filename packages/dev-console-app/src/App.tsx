import React from 'react';
import '@shopify/polaris/dist/styles.css';
import enTranslations from '@shopify/polaris/locales/en.json';
import {AppProvider} from '@shopify/polaris';
import {I18nContext, I18nManager} from '@shopify/react-i18n';
import {ExtensionServerProvider} from '@shopify/ui-extensions-dev-console';
import {BrowserRouter} from 'react-router-dom';

import * as styles from './theme.module.css';
import {DevConsole} from './DevConsole';

const extensionServerOptions = {
  connection: {
    url: 'ws://localhost:8000/extensions/',
  },
};

const locale = 'en';
const i18nManager = new I18nManager({
  locale,
  onError(error) {
    // eslint-disable-next-line no-console
    console.log(error);
  },
});
function App() {
  return (
    <div className={styles.Theme}>
      <ExtensionServerProvider options={extensionServerOptions}>
        <I18nContext.Provider value={i18nManager}>
          <AppProvider i18n={enTranslations}>
            <BrowserRouter>
              <DevConsole />
            </BrowserRouter>
          </AppProvider>
        </I18nContext.Provider>
      </ExtensionServerProvider>
    </div>
  );
}

export default App;
