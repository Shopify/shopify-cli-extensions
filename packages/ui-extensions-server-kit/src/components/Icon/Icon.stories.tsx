import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';

import {CancelSmallMinor, HideMinor, RefreshMinor, ToolsMajor, ViewMinor} from './icons';
import {Icon} from './Icon';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Components/Icon',
  component: Icon,
} as ComponentMeta<any>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<any> = (args) => (
  <>
    <Icon {...args} source={CancelSmallMinor} />
    <Icon {...args} source={HideMinor} />
    <Icon {...args} source={RefreshMinor} />
    <Icon {...args} source={ToolsMajor} />
    <Icon {...args} source={ViewMinor} />
  </>
);

export const Base = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Base.args = {};
