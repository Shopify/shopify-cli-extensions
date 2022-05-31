/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, {MouseEvent, useCallback, useState} from 'react';
import {useI18n} from '@shopify/react-i18n';
import {ExtensionPayload} from '@shopify/ui-extensions-server-kit';

import {Checkbox} from '../CheckBox';
import {ActionSet, ActionSetProps} from '../ActionSet';

import * as styles from './ExtensionRow.module.scss';
import en from './translations/en.json';

export type ExtensionRowProps = {
  extension: ExtensionPayload;
  selected?: boolean;
  onSelect(extension: ExtensionPayload): void;
  onHighlight(extension: ExtensionPayload): void;
  onClearHighlight(): void;
} & Pick<ActionSetProps, 'onShowMobileQRCode' | 'onCloseMobileQRCode'>;

export function ExtensionRow({
  extension,
  selected,
  onSelect,
  onHighlight,
  onClearHighlight,
  ...actionSetProps
}: ExtensionRowProps) {
  const [i18n] = useI18n({
    id: 'ExtensionRow',
    fallback: en,
  });
  const {
    development: {hidden, status},
  } = extension;

  const handleSelect = useCallback(
    (event?: MouseEvent) => {
      if (event) {
        event.stopPropagation();
      }
      onSelect(extension);
    },
    [extension, onSelect],
  );
  const [isFocus, setFocus] = useState(false);

  const textClass = hidden ? styles.Hidden : undefined;
  const statusClass = status ? (styles as any)[status || 'error'] : styles.error;

  return (
    <tr
      className={styles.DevToolRow}
      onFocus={() => {
        setFocus(true);
      }}
      onBlur={() => {
        setFocus(false);
      }}
      onMouseEnter={() => onHighlight(extension)}
      onMouseLeave={onClearHighlight}
    >
      <td>
        <Checkbox label="" checked={selected} onChange={() => handleSelect()} />
      </td>
      <td onClick={handleSelect} className={textClass}>
        {extension.title}
      </td>
      <td onClick={handleSelect} className={textClass}>
        {extension.type}
      </td>
      <td onClick={handleSelect}>
        <span className={`${styles.Status} ${statusClass}`}>
          {i18n.translate(`statuses.${status}`)}
        </span>
      </td>
      <ActionSet
        className={`${styles.ActionSet} ${isFocus ? styles.ForceVisible : ''}`}
        selected={selected}
        extension={extension}
        {...actionSetProps}
      />
    </tr>
  );
}
