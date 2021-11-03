import React from 'react';
import {Meta, Story} from '@storybook/react/types-6-0';

import {
  ToggleViewAction,
  RefreshAction,
  RemoveAction,
} from '../ActionSet/actions';
import {ExtensionRow} from '../ExtensionRow';
import {ExtensionHeaderRow} from '../ExtensionHeaderRow';

import {ExtensionsTable, ExtensionsTableProps} from './ExtensionsTable';

export default {
  title: 'dev-console/ExtensionsTable',
  component: ExtensionsTable,
} as Meta;

const Template: Story<ExtensionsTableProps> = () => (
  <ExtensionsTable
    header={(context) => (
      <ExtensionHeaderRow
        {...context}
        actions={
          <>
            <ToggleViewAction />
            <RemoveAction />
            <RefreshAction />
          </>
        }
      />
    )}
    renderItem={(context) => (
      <ExtensionRow
        {...context}
        actions={
          <>
            <ToggleViewAction />
            <RemoveAction />
            <RefreshAction />
          </>
        }
      />
    )}
  />
);

export const Base = Template.bind({});

Base.args = {};
