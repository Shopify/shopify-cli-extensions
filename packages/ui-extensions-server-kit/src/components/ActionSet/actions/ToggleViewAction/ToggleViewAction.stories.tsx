import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';

import {ToggleViewAction} from './ToggleViewAction';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Components/Action',
  component: ToggleViewAction,
} as ComponentMeta<typeof ToggleViewAction>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<any> = () => <ToggleViewAction />;

export const ToggleView = Template.bind({});
