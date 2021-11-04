import React from 'react';

import {useDevConsole} from '../../../../state/context';
import {RefreshMinor} from '../../../Icon/icons';
import {Action} from '../../Action';
import {useExtensions} from '../../../../utilities/extensionPayload';

export function RefreshAction() {
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
