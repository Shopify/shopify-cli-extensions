import React, {MouseEvent} from 'react';

import {classNames} from '../../../utilities';
import {Icon, IconSource} from '../../Icon';

import styles from './Action.scss';

export interface ActionProps {
  /** Descriptive text to be read by screenreaders */
  accessibilityLabel: string;

  /** The SVG contents to display in the icon (icons should fit in a 20 × 20 pixel viewBox) */
  source: IconSource;

  onAction: () => void;

  /** If true, sets visibility to hidden */
  hidden?: boolean;
}

export function Action({accessibilityLabel, hidden, onAction, source}: ActionProps) {
  const onClick = (event: MouseEvent) => {
    event.stopPropagation();
    onAction();
  };

  return (
    <div className={styles.Action}>
      <button type="button" className={classNames(hidden && styles.Hidden)} onClick={onClick}>
        <Icon source={source} accessibilityLabel={accessibilityLabel} />
      </button>
    </div>
  );
}
