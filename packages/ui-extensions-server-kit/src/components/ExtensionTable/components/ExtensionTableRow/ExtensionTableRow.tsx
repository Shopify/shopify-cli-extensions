import React from 'react';

import {ExtensionPayload} from '../../../../types';
import {Checkbox, Status, StatusType} from '../../..';
import {ActionSet} from '../../../ActionSet';

import styles from './ExtensionTableRow.scss';

export interface ExtensionTableRowProps {
  /** Disable input */
  extension: ExtensionPayload;

  /** Whether the checkbox input is checked and the extension is included in the selectedExtensions */
  selected: boolean;

  /** Callback fired when pressing a row on checkbox input; toggles selection state */
  toggleSelection(extension: ExtensionPayload, value?: boolean): void;

  /** Callback fired when hovering over row */
  onHighlight(extension: ExtensionPayload): void;

  /** Callback fired when mouse leaves row */
  onClearHighlight(): void;

  /** Custom actions for row */
  actions: React.ReactElement;
}

/** Row for displaying extension data in ExtensionTable */
export function ExtensionTableRow({
  extension,
  selected,
  toggleSelection,
  onHighlight,
  onClearHighlight,
  actions,
}: ExtensionTableRowProps) {
  const {
    assets: {
      main: {name},
    },
    type,
    development: {status, hidden},
  } = extension;

  const textClass = hidden ? styles.hidden : undefined;

  return (
    <tr
      className={styles.extensionTableRow}
      onClick={(event: {stopPropagation: () => void}) => {
        event.stopPropagation();
        toggleSelection(extension);
      }}
      onMouseEnter={() => onHighlight(extension)}
      onMouseLeave={() => onClearHighlight()}
    >
      <td>
        <Checkbox
          checked={selected}
          onChange={() => {
            toggleSelection(extension);
          }}
        />
      </td>
      <td className={textClass}>{name}</td>
      <td className={textClass}>{type}</td>
      <td>
        <Status status={status === 'success' ? StatusType.Connected : StatusType.BuildError} />
      </td>
      <td className={styles.ActionSet}>
        <ActionSet extensions={[extension]}>{actions}</ActionSet>
      </td>
    </tr>
  );
}
