import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';

import {ViewMinor} from '../../Icon';

import {Action as ActionComponent} from './Action';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Components/Action',
  component: ActionComponent,
  argTypes: {
    source: {
      control: false,
    },
  },
} as ComponentMeta<typeof ActionComponent>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<any> = (args) => <ActionComponent {...args} />;

export const Base = Template.bind({});
Base.args = {
  accessibilityLabel: 'test',
  source: ViewMinor,
};
