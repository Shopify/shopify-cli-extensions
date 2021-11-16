import React, {useCallback, useState} from 'react';

import {ExtensionPayload} from '../../types';
import {useDevConsole} from '../../state/context';
import {RefreshAction, ToggleViewAction} from '..';

import {
  ExtensionTableHeader,
  ExtensionTableRowProps,
  ExtensionTableHeaderProps,
} from './components';
import styles from './ExtensionTable.scss';

type RenderItemContext = Omit<ExtensionTableRowProps, 'actions' | 'columns'>;
type RenderHeaderContext = Omit<ExtensionTableHeaderProps, 'actions' | 'columns'>;

export interface ExtensionTableProps {
  /** Function that returns a custom header element */
  header?: (context: RenderHeaderContext) => React.ReactElement;

  /** Function that returns row element */
  renderItem: (context: RenderItemContext) => React.ReactElement;
}

/**
 * Table that contains each extension as a row item.
 *
 * Custom header and rows will be passed context to allow them to interact with the main table.
 * They will receive extensions, and select and highlight interactions.
 * See the ExtensionTableRow and ExtensionTableHeader args for more information.
 *
 * `type RenderItemContext = Omit<ExtensionTableRowProps, 'actions' | 'columns'>;`
 * `type RenderHeaderContext = Omit<ExtensionTableHeaderProps, 'actions' | 'columns'>;`
 */
export function ExtensionTable({header, renderItem}: ExtensionTableProps) {
  const {extensions, dispatch} = useDevConsole();
  const [selectedExtensionsKeys, setSelectedExtensionsKeys] = useState<Set<string>>(
    () => new Set(),
  );

  const toggleSelection = useCallback((extension: ExtensionPayload) => {
    console.log('toggle');
    setSelectedExtensionsKeys((set) => {
      // if set.delete -> false, the extension is not included in setSelectedExtensionsKeys - therefore add it.
      if (!set.delete(extension.uuid)) set.add(extension.uuid);
      console.log({set});
      return new Set(set);
    });
  }, []);

  const setSelected = (selectedExtensions: ExtensionPayload[]) => {
    setSelectedExtensionsKeys(new Set(selectedExtensions.map(({uuid}) => uuid)));
  };

  const isSelected = ({uuid}: ExtensionPayload) => {
    // console.log()
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
        header({extensions, onSelected: setSelected, selectedExtensions})
      ) : (
        <ExtensionTableHeader
          extensions={extensions}
          selectedExtensions={selectedExtensions}
          onSelected={setSelected}
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
