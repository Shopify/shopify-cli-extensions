import React, {MouseEvent} from 'react';
import {Icon, IconSource} from '@shopify/polaris';

import * as styles from './Action.module.scss';

export interface ActionProps {
  /** Custom class for the button */
  className?: string;

  /** Accessibility label for the action */
  accessibilityLabel: string;

  /** Icon source of the action */
  source: IconSource;

  /** Action callback */
  onAction: () => void;
}

/**
 * Custom action inside an action set. Use with `useExtensions` to perform an action on extensions passed by the ActionSet.
 */
export function Action({accessibilityLabel, className, onAction, source}: ActionProps) {
  const onClick = (event: MouseEvent) => {
    event.stopPropagation();
    onAction();
  };

  return (
    <div className={styles.Action}>
      <button type="button" className={className} onClick={onClick}>
        <Icon source={source} accessibilityLabel={accessibilityLabel} />
      </button>
    </div>
  );
}
