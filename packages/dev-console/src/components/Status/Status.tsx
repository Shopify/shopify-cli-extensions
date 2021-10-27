import React from 'react';

import {classNames} from '../../utilities/classNames';

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

export function Status({status = StatusType.Connected}) {
  const statusClass = classNames(styles.Status, styles[status] ?? styles.BuildError);

  return <span className={statusClass}>{status}</span>;
}
