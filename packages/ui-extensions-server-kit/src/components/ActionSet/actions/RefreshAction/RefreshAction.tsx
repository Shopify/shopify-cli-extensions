import React from 'react';
import {useI18n} from '@shopify/react-i18n';

import {useDevConsole} from '../../../../state/context';
import {RefreshMinor} from '../../../Icon/icons';
import {Action} from '../../Action';
import {useExtensions} from '../../../../utilities/extensionPayload';
import en from '../../translations/en.json';

export function RefreshAction() {
  const [i18n] = useI18n({
    id: 'actions',
    fallback: en,
  });
  const {dispatch} = useDevConsole();
  const extensions = useExtensions();

  return (
    <Action
      source={RefreshMinor}
      accessibilityLabel={i18n.translate('refresh')}
      onAction={() =>
        dispatch({
          type: 'refresh',
          payload: extensions,
        })
      }
    />
  );
}
