import React, {useMemo} from 'react';
import {Meta, Story} from '@storybook/react/types-6-0';

import {DevServerContext} from '../../../state/context';
import {mockExtension} from '../../../testing';
import {
  ExtensionTable,
  ExtensionTableProps,
  ExtensionTableRow,
  ExtensionTableHeader,
  ToggleViewAction,
  RefreshAction,
  ActionSpacer,
} from '../..';

function DevConsoleProvider({children}: any) {
  const value = useMemo(
    () => ({
      host: '',
      store: '',
      send: () => undefined,
      extensions: [
        mockExtension(),
        mockExtension({type: 'product_subscription', assets: {main: {name: 'other'}}}),
      ],
      addListener: () => () => undefined,
    }),
    [],
  );

  return <DevServerContext.Provider value={value}>{children}</DevServerContext.Provider>;
}

export default {
  title: 'Components/ExtensionsTable',
  component: ExtensionTable,
  subcomponents: {ExtensionTableHeader, ExtensionTableRow},
  decorators: [(story) => <DevConsoleProvider>{story()}</DevConsoleProvider>],
} as Meta;

const Template: Story<ExtensionTableProps> = () => (
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
);

export const Base = Template.bind({});

Base.args = {};

export const CustomColumns = () => (
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
);
