import React from 'react';
import {classNames} from '@/utilities';

import styles from './Status.scss';

export enum StatusType {
  Connected = 'Connected',
  Disconnected = 'Disconnected',
  BuildError = 'BuildError',
}

export interface StatusProps {
  /** Status for the status of the extension */
  status?: StatusType;
}

/** Status shows you the connection state of an extension */
export function Status({status = StatusType.Connected}) {
  const statusClass = classNames(styles.Status, styles[status] ?? styles.BuildError);
  const text = status;

  return <span className={statusClass}>{text}</span>;
}
