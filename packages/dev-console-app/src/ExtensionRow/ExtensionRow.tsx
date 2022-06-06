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

  const handleRowSelect = useCallback(
    (event?: MouseEvent) => {
      if (event) {
        event?.stopPropagation();
      }

      // Ignore the case of the checkbox itself being selected, which is handled by handleCheckBoxSelect
      const target = event?.target as Element;
      if (!target.className.match(/Polaris-Checkbox/)) {
        onSelect(extension);
      }
    },
    [extension, onSelect],
  );

  const handleCheckboxSelect = useCallback(
    (newChecked?: boolean) => {
      if (newChecked !== selected) {
        onSelect(extension);
      }
    },
    [selected, onSelect, extension],
  );

  const [isFocus, setFocus] = useState(false);

  const textClass = hidden ? styles.Hidden : undefined;
  const statusClass = status ? (styles as any)[status || 'error'] : styles.error;

  return (
    <tr
      className={styles.DevToolRow}
      onClick={handleRowSelect}
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
        <Checkbox label="" checked={selected} onChange={handleCheckboxSelect} />
      </td>
      <td className={textClass}>{extension.title}</td>
      <td className={textClass}>{extension.type}</td>
      <td>
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
