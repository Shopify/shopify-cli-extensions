import React from 'react';

// import {useI18n} from '@shopify/react-i18n';
import {useDevConsole} from '../../../../state/context';
import {RefreshMinor} from '../../../Icon/icons';
import {Action} from '../../Action';
import {Action as ActionType} from '../../../../types';

export function RefreshAction() {
  // const [i18n] = useI18n();
  const {dispatch} = useDevConsole();
  const refreshAction: ActionType<'refresh', {uuid: string}[]> = {
    type: 'refresh',
    payload: [{uuid: ''}],
  };
  return (
    <Action
      source={RefreshMinor}
      accessibilityLabel="Refresh"
      onAction={() => dispatch(refreshAction)}
    />
  );
}
