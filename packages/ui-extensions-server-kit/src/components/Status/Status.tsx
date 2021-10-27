import React from 'react';
import {useI18n} from '@shopify/react-i18n';

import {classNames} from '../../utilities/classNames';

import styles from './Status.scss';

export enum StatusType {
  Connected = 'Connected',
  Disconnected = 'Disconnected',
  BuildError = 'BuildError',
}

export interface StatusProps {
  status?: StatusType;
}

export function Status({status = StatusType.Connected}) {
//   const [i18n] = useI18n();
  const statusClass = classNames(styles.Status, styles[status] ?? styles.BuildError);
//   const text = i18n.translationKeyExists(`${status}`)
//     ? i18n.translate(`${status}`)
//     : i18n.translate('BuildError');

  return <span className={statusClass}>{status}</span>;
}
