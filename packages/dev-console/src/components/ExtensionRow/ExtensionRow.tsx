import React, {useMemo} from 'react';

import {ExtensionManifestData} from '../types';
import {Checkbox} from '../CheckBox';
import {ActionSet} from '../ActionSet';

import {Status} from './Status';
import styles from './ExtensionRow.scss';

export interface ExtensionRowProps {
  extension: ExtensionManifestData;
  selected: boolean;
  toggleSelection(): void;
  onHighlight(): void;
  onClearHighlight(): void;
  actions: React.ReactElement;
}

export function ExtensionRow({
  extension,
  selected,
  toggleSelection,
  onHighlight,
  onClearHighlight,
  actions,
}: ExtensionRowProps) {
  const {identifier, name, scriptUrl, status, hidden} = extension;

  const scriptHost = useMemo(() => {
    if (!scriptUrl) return null;
    const url = new URL(scriptUrl.toString());
    return `${url.protocol}//${url.host}`;
  }, [scriptUrl]);

  const textClass = hidden ? styles.Hidden : undefined;

  return (
    <tr
      className={styles.DevToolRow}
      onClick={(event: {preventDefault: () => void}) => {
        event.preventDefault();
        toggleSelection();
      }}
      onMouseEnter={onHighlight}
      onMouseLeave={onClearHighlight}
    >
      <td>
        <Checkbox checked={selected} onChange={toggleSelection} />
      </td>
      <td className={textClass}>{name}</td>
      <td className={textClass}>{identifier}</td>
      <td className={textClass}>
        <a className={styles.Url} href={scriptHost || '#'}>
          {scriptHost}
        </a>
      </td>
      <td>
        <Status status={status} />
      </td>
      <td className={styles.ActionSet}>
        <ActionSet extensions={[extension]}>{actions}</ActionSet>
      </td>
    </tr>
  );
}
