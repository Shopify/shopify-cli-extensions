import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';

import {RefreshAction} from './RefreshAction';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Components/Action',
  component: RefreshAction,
} as ComponentMeta<typeof RefreshAction>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<any> = () => <RefreshAction />;

export const Refresh = Template.bind({});
