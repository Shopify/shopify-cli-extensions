import React from 'react';

import {ExtensionPayloadContext} from '../../utilities/extensionPayload';
import {ExtensionPayload} from '../../types';

import styles from './ActionSet.scss';

interface ActionSetPropsBase {
  /** Extension payload data used by the actions */
  extensions: ExtensionPayload[];
}

export type ActionSetProps = React.PropsWithChildren<ActionSetPropsBase>;

export function ActionSet({extensions, children}: ActionSetProps) {
  return (
    <ExtensionPayloadContext.Provider value={extensions}>
      <div className={styles.ActionGroup}>{children}</div>
    </ExtensionPayloadContext.Provider>
  );
}
