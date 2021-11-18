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
  onSelected: (extensions: ExtensionPayload[]) => void;

  /** Custom actions for header */
  actions: React.ReactElement;
}

/** Header for ExtensionTable */
export function ExtensionTableHeader({
  columns,
  extensions,
  selectedExtensions,
  onSelected,
  actions,
}: ExtensionTableHeaderProps) {
  const allSelected = selectedExtensions.length === extensions.length;

  const toggleSelectAll = () => {
    if (allSelected) {
      onSelected([]);
    } else {
      onSelected(extensions);
    }
  };

  return (
    <thead>
      <tr className={styles.extensionTableHeader}>
        <th>
          <Checkbox
            checked={allSelected}
            onChange={toggleSelectAll}
            accessibilityLabel={allSelected ? 'deselect all' : 'select all'}
          />
        </th>
        {columns ? (
          columns.map((column) => <th key={column}>{column}</th>)
        ) : (
          <>
            <th>Name</th>
            <th>Type</th>
            <th>Status</th>
          </>
        )}
        <th>
          <ActionSet extensions={selectedExtensions}>{actions}</ActionSet>
        </th>
      </tr>
    </thead>
  );
}
