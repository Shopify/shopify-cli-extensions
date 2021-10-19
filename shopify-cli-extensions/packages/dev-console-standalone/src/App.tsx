import React, {useMemo} from 'react';
import '@shopify/polaris/dist/styles.css';
import enTranslations from '@shopify/polaris/locales/en.json';
import {AppProvider} from '@shopify/polaris';
import {I18nContext, I18nManager} from '@shopify/react-i18n';
import {DevConsoleProvider} from '@shopify/ui-extensions-dev-console';

import * as styles from './theme.css';
import {UIExtensionsDevTool} from './UIExtensionsDevTool';

function App() {
  const locale = 'en';
  const i18nManager = useMemo(
    () =>
      new I18nManager({
        locale,
        onError(error) {
          // eslint-disable-next-line no-console
          console.log(error);
        },
      }),
    [],
  );

  return (
    <div className={styles.Theme}>
      <I18nContext.Provider value={i18nManager}>
        <AppProvider i18n={enTranslations}>
          <DevConsoleProvider host="ws://localhost:8000/extensions/">
            <UIExtensionsDevTool />
          </DevConsoleProvider>
        </AppProvider>
      </I18nContext.Provider>
    </div>
  );
}

export default App;
