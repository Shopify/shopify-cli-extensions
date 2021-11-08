import React from 'react';

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
  const statusClass = classNames(styles.Status, styles[status] ?? styles.BuildError);
  const text = status;

  return <span className={statusClass}>{text}</span>;
}
