import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';

import {ExtensionPayload} from '../../types';
import {mockExtensions} from '../../testing';

import {RefreshAction, ToggleViewAction} from './actions';
import {ActionSet} from './ActionSet';
import {ActionSpacer} from './ActionSpacer';
import {Action} from './Action';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Components/ActionSet',
  component: ActionSet,
  parameters: {viewMode: 'docs'},
  subcomponents: {Action},
  argTypes: {
    source: {control: false},
    children: {control: false},
    extensions: {control: false},
  },
} as ComponentMeta<typeof ActionSet>;

const containerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
};

const mockExtensionPayload: ExtensionPayload[] = mockExtensions();
// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<any> = (args) => (
  <div style={containerStyle}>
    <ActionSet {...args} extensions={mockExtensionPayload} />
  </div>
);

export const Base = () => (
  <div style={containerStyle}>
    <ActionSet extensions={mockExtensionPayload}>
      <RefreshAction />
      <ToggleViewAction />
    </ActionSet>
  </div>
);

export const WithActionSpacer = () => (
  <div style={containerStyle}>
    <ActionSet extensions={mockExtensionPayload}>
      <RefreshAction />
      <ActionSpacer />
      <ToggleViewAction />
    </ActionSet>
  </div>
);
