import React from 'react';

// import {useI18n} from '@shopify/react-i18n';
import {useDevConsole} from '../../../../state/context';
import {RefreshMinor} from '../../../Icon/icons';
import {Action} from '../../Action';
import {Action as ActionType} from '../../../../types';
import {useExtensions} from '../../../../utilities/extensionPayload';

export function RefreshAction() {
  // const [i18n] = useI18n();
  const {dispatch} = useDevConsole();
  const extensions = useExtensions();

  return (
    <Action
      source={RefreshMinor}
      accessibilityLabel="Refresh"
      onAction={() =>
        dispatch({
          type: 'refresh',
          payload: extensions,
        })
      }
    />
  );
}
