import React, {useMemo, useState} from 'react';
import {Meta, Story} from '@storybook/react/types-6-0';
import {action} from '@storybook/addon-actions';
import {
  ExtensionTable,
  ExtensionTableProps,
  ExtensionTableRow,
  ExtensionTableHeader,
  ToggleViewAction,
  RefreshAction,
  ActionSpacer,
} from 'components';
import {DevServerContext} from 'state';
import {mockExtension} from 'testing';
import {DevServerCall, ExtensionPayload} from 'types';

import styles from './ExtensionTable.stories.module.scss';

export default {
  title: 'Components/ExtensionsTable',
  component: ExtensionTable,
  subcomponents: {ExtensionTableHeader, ExtensionTableRow},
} as Meta<typeof ExtensionTable>;

const send = action('send');

function useMockDevServerContext(
  extensions: ExtensionPayload[],
  setExtensions: (extensions: ExtensionPayload[]) => void,
) {
  return useMemo(
    () =>
      ({
        send: (callData: DevServerCall) => {
          if (callData.event === 'update') {
            const hidden = callData.data.extensions?.[0].development?.hidden || false;
            for (const extension of extensions) {
              if (callData.data.extensions!.find(({uuid}) => uuid === extension.uuid)) {
                extension.development.hidden = hidden;
              }
            }

            setExtensions([...extensions]);
          } else if (callData.data.type === 'focus' || callData.data.type === 'unfocus') {
            return;
          }
          send(callData);
        },
      } as any),
    [extensions, setExtensions],
  );
}

const Template: Story<ExtensionTableProps> = () => {
  const [extensions, setExtensions] = useState(() => [
    mockExtension(),
    mockExtension({type: 'product_subscription', assets: {main: {name: 'other'}}}),
  ]);
  const {send} = useMockDevServerContext(extensions, setExtensions);
  const context: any = useMemo(
    () => ({
      send,
      extensions,
    }),
    [send, extensions],
  );

  return (
    <DevServerContext.Provider value={context}>
      <div className={styles.wrapper}>
        <ExtensionTable
          renderItem={({extension, selected, toggleSelection, onHighlight, onClearHighlight}) => (
            <ExtensionTableRow
              extension={extension}
              selected={selected}
              toggleSelection={toggleSelection}
              onHighlight={onHighlight}
              onClearHighlight={onClearHighlight}
              actions={
                <>
                  <RefreshAction />
                  <ToggleViewAction />
                </>
              }
            />
          )}
        />
      </div>
    </DevServerContext.Provider>
  );
};

export const Base = Template.bind({});

Base.args = {};

export const CustomColumns = () => (
  <div className={styles.wrapper}>
    <ExtensionTable
      header={(context) => (
        <ExtensionTableHeader
          {...context}
          columns={['Name', 'Type']}
          actions={
            <>
              <RefreshAction />
              <ActionSpacer />
            </>
          }
        />
      )}
      renderItem={({extension, selected, toggleSelection, onHighlight, onClearHighlight}) => (
        <ExtensionTableRow
          extension={extension}
          selected={selected}
          toggleSelection={toggleSelection}
          onHighlight={onHighlight}
          onClearHighlight={onClearHighlight}
          columns={[extension.assets.main.name, extension.type?.replace('_', ' ')]}
          actions={
            <>
              <RefreshAction />
              <ToggleViewAction />
            </>
          }
        />
      )}
    />
  </div>
);
