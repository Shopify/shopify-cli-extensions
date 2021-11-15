import React, {useMemo} from 'react';
import {Meta, Story} from '@storybook/react/types-6-0';

import {DevServerContext} from '../../../state/context';
import {mockExtension} from '../../../testing';
import {
  ExtensionTable,
  ExtensionTableProps,
  ExtensionTableRow,
  ToggleViewAction,
  RefreshAction,
} from '../..';

function DevConsoleProvider({children}: any) {
  const value = useMemo(
    () => ({
      host: '',
      store: '',
      send: () => undefined,
      extensions: [mockExtension(), mockExtension()],
      addListener: () => () => undefined,
    }),
    [],
  );

  return <DevServerContext.Provider value={value}>{children}</DevServerContext.Provider>;
}

export default {
  title: 'Components/ExtensionsTable',
  component: ExtensionTable,
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
