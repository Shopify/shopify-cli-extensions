import React from 'react';
import {Meta, Story} from '@storybook/react/types-6-0';

import {extensionManifestFixture} from '../mocks';
import {
  ToggleViewAction,
  RefreshAction,
  RemoveAction,
} from '../ActionSet/actions';

import {ExtensionRow, ExtensionRowProps} from './ExtensionRow';

export default {
  title: 'dev-console/ExtensionRow',
  component: ExtensionRow,
  argTypes: {
    toggleSelection: {action: 'toggle selection'},
    onHighlight: {action: 'highlight'},
    onHighlightClear: {action: 'highlight clear'},
  },
} as Meta;

const Template: Story<ExtensionRowProps> = (args) => (
  <ExtensionRow
    {...args}
    actions={
      <>
        <ToggleViewAction />
        <RemoveAction />
        <RefreshAction />
      </>
    }
  />
);

const defaultProps = {
  extension: extensionManifestFixture()[0],
  selected: false,
  onSelect() {},
  onHighlight() {},
  onClearHighlight() {},
};

export const Base = Template.bind({});

Base.args = {...defaultProps};

export const Selected = Template.bind({});

Selected.args = {...defaultProps, selected: true};
