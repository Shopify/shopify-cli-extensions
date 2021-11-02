import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';

import {ExtensionPayload} from '../../types';
import {mockExtensions} from '../../testing';

import {RefreshAction, ToggleViewAction} from './actions';
import {ActionSet} from './ActionSet';
import {ActionSpacer} from './ActionSpacer';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Components/ActionSet',
  component: ActionSet,
  argTypes: {
    source: {control: false},
    children: {control: false},
    extensions: {control: false},
  },
} as ComponentMeta<typeof ActionSet>;

const mockExtensionPayload: ExtensionPayload[] = mockExtensions();
// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<any> = (args) => (
  <ActionSet {...args} extensions={mockExtensionPayload} />
);

export const Base = Template.bind({});
Base.args = {
  children: (
    <>
      <RefreshAction />
      <ActionSpacer />
      <ToggleViewAction />
    </>
  ),
};
