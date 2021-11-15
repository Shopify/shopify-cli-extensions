import React from 'react';
import {createMount} from '@shopify/react-testing';
import {I18nContext, I18nManager} from '@shopify/react-i18n';

export const mount = createMount<any>({
  render(element) {
    const locale = 'en';
    // eslint-disable-next-line react/jsx-no-constructed-context-values
    const i18nManager = new I18nManager({
      locale,
      onError(error) {
        // eslint-disable-next-line no-console
        console.log(error);
      },
    });

    return <I18nContext.Provider value={i18nManager}>{element}</I18nContext.Provider>;
  },
});
