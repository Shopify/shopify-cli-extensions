import React from 'react';

import {ExtensionPayload} from '../../../../types';
import {Checkbox} from '../../../CheckBox';
import {ActionSet} from '../../../ActionSet';

import styles from './ExtensionTableHeader.scss';

export interface ExtensionTableHeaderProps {
  /** Custom column titles */
  columns?: string[];

  /** All extensions for managing selection state */
  extensions: ExtensionPayload[];

  /** Subset of selected extensions */
  selectedExtensions: ExtensionPayload[];

  /** Callback to manage selected state of all extensions */
  setSelected: (extensions: ExtensionPayload[]) => void;

  /** Custom actions for header */
  actions: React.ReactElement;
}

/** Header for ExtensionTable */
export function ExtensionTableHeader({
  columns,
  extensions,
  selectedExtensions,
  setSelected,
  actions,
}: ExtensionTableHeaderProps) {
  const allSelected = selectedExtensions.length === extensions.length;

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelected([]);
    } else {
      setSelected(extensions);
    }
  };

  return (
    <thead>
      <tr className={styles.extensionTableHeader}>
        {columns ? (
          columns.map((column) => <th key={column}>{column}</th>)
        ) : (
          <>
            <th>
              <Checkbox
                checked={allSelected}
                onChange={toggleSelectAll}
                accessibilityLabel={allSelected ? 'deselect all' : 'select all'}
              />
            </th>
            <th>Name</th>
            <th>Type</th>
            <th>Status</th>
            <th>
              <ActionSet extensions={selectedExtensions}>{actions}</ActionSet>
            </th>
          </>
        )}
      </tr>
    </thead>
  );
}
