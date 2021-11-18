import React from 'react';
import {ExtensionContext} from 'utilities';
import {ExtensionPayload} from 'types';

import styles from './ActionSet.scss';

interface ActionSetPropsBase {
  /** Extension payload data used by the actions */
  extensions: ExtensionPayload[];
}

export type ActionSetProps = React.PropsWithChildren<ActionSetPropsBase>;

/**
 * ActionSet is a group of actions available to an extension or extensions.
 * The extension header will perform actions on selected extensions, while an extension row will perform actions on a single extension.
 *
 * Two default actions are available: `<RefreshAction />`, and `<ToggleViewAction />`.
 * They will be passed the extensions in context.
 *
 * Custom actions can be created with a combination of `<Action />` and the `useExtensions()` hook.
 *
 * Finally, it can be useful to align actions on ExtensionHeader and ExtensionRow actions. But sometimes not all actions
 * are needed in the header. You can add spacing between actions by using `<ActionSpacer />`.
 */
export function ActionSet({extensions, children}: ActionSetProps) {
  return (
    <ExtensionContext.Provider value={extensions}>
      <div className={styles.ActionSet}>{children}</div>
    </ExtensionContext.Provider>
  );
}
