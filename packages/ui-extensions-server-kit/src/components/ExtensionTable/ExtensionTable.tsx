import React, {useCallback, useState} from 'react';

import {ExtensionPayload} from '../../types';
import {useDevConsole} from '../../state/context';
import {RefreshAction, ToggleViewAction} from '..';

import {ExtensionTableHeader, ExtensionTableRowProps} from './components';
import styles from './ExtensionTable.scss';

type RenderItemContext = Omit<ExtensionTableRowProps, 'actions'>;

export interface ExtensionTableProps {
  /** Custom header element */
  header?: React.ReactElement;

  /** Function that returns row element */
  renderItem: (context: RenderItemContext) => React.ReactElement;
}

/** Table that contains each extension as a row item. */
export function ExtensionTable({header, renderItem}: ExtensionTableProps) {
  const {extensions, dispatch} = useDevConsole();
  const [selectedExtensionsKeys, setSelectedExtensionsKeys] = useState<Set<string>>(
    () => new Set(),
  );

  const toggleSelection = useCallback((extension: ExtensionPayload) => {
    setSelectedExtensionsKeys((set) => {
      // if set.delete -> false, the extension is not included in setSelectedExtensionsKeys - therefore add it.
      if (!set.delete(extension.uuid)) set.add(extension.uuid);
      return new Set(set);
    });
  }, []);

  const setSelected = (selectedExtensions: ExtensionPayload[]) => {
    setSelectedExtensionsKeys(new Set(selectedExtensions.map(({uuid}) => uuid)));
  };

  const isSelected = ({uuid}: ExtensionPayload) => {
    return selectedExtensionsKeys.has(uuid);
  };

  const selectedExtensions = extensions.filter(isSelected);

  const onHighlight = (extension: ExtensionPayload) => {
    dispatch({type: 'focus', payload: [{uuid: extension.uuid}]});
  };

  const onClearHighlight = () => dispatch({type: 'unfocus'});

  return (
    <table className={styles.extensionTable}>
      {header ? (
        header
      ) : (
        <ExtensionTableHeader
          extensions={extensions}
          selectedExtensions={selectedExtensions}
          setSelected={setSelected}
          actions={
            <>
              <RefreshAction />
              <ToggleViewAction />
            </>
          }
        />
      )}
      <tbody>
        {extensions.map((extension) => {
          return (
            <React.Fragment key={extension.uuid}>
              {renderItem({
                extension,
                selected: isSelected(extension),
                toggleSelection,
                onHighlight,
                onClearHighlight,
              })}
            </React.Fragment>
          );
        })}
      </tbody>
    </table>
  );
}
