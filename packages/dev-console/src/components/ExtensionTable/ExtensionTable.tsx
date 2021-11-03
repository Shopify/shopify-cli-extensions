import React, {useState} from 'react';

import {ExtensionManifestData} from '../types';
import {getLocalExtensionKey} from '../utils';
import {useDevConsole} from '../hooks/useDevConsole';
import {ExtensionHeaderRowProps} from '../ExtensionHeaderRow';
import {ExtensionRowProps} from '../ExtensionRow';

import styles from './ExtensionsTable.scss';

type HeaderContext = Omit<ExtensionHeaderRowProps, 'actions'>;
type RenderItemContext = Omit<ExtensionRowProps, 'actions'>;

export interface ExtensionsTableProps {
  header: (context: HeaderContext) => React.ReactElement;
  renderItem: (context: RenderItemContext) => React.ReactElement;
}

export function ExtensionsTable({header, renderItem}: ExtensionsTableProps) {
  const {extensions, add} = useDevConsole();

  const [selectedExtensionsKeys, setSelectedExtensionsKeys] = useState<
    Set<string>
  >(() => new Set());

  const toggleSelection = (extension: ExtensionManifestData) => {
    const key = getLocalExtensionKey(extension);
    setSelectedExtensionsKeys((original) => {
      // delete fails when key isn't found, so we toggle it on
      if (!original.delete(key)) original.add(key);
      return original;
    });
  };

  const setSelected = (selectedExtensions: ExtensionManifestData[]) => {
    setSelectedExtensionsKeys(
      new Set(selectedExtensions.map(getLocalExtensionKey)),
    );
  };

  const onHighlight = (extension: ExtensionManifestData) => {
    const key = getLocalExtensionKey(extension);
    add(
      extensions.map((extension) => ({
        ...extension,
        focused: getLocalExtensionKey(extension) === key,
      })),
    );
  };

  const onClearHighlight = () =>
    add(extensions.map((extension) => ({...extension, focused: false})));

  const isSelected = (extension: ExtensionManifestData) =>
    selectedExtensionsKeys.has(getLocalExtensionKey(extension));

  const selectedExtensions = extensions.filter(isSelected);

  return (
    <section className={styles.ExtensionList}>
      <table>
        <thead>
          {header({
            extensions,
            selectedExtensions,
            setSelected,
          })}
        </thead>
        <tbody>
          {extensions.map((extension) => {
            const key = getLocalExtensionKey(extension);
            return (
              <React.Fragment key={key}>
                {renderItem({
                  extension,
                  selected: isSelected(extension),
                  toggleSelection: () => toggleSelection(extension),
                  onHighlight: () => onHighlight(extension),
                  onClearHighlight,
                })}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </section>
  );
}
