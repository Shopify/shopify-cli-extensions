import React from 'react';

import styles from './ActionSpacer.scss';

/**
 * Adds spacing between actions in an action set. Useful for matching ExtensionHeader and ExtensionRow actions alignment.
 */
export function ActionSpacer() {
  return <div className={styles.Spacer} />;
}
