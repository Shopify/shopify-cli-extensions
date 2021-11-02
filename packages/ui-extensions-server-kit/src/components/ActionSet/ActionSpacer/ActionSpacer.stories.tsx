import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';

import {ActionSpacer as ActionSpacerComponent} from './ActionSpacer';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Components/Action',
  component: ActionSpacerComponent,
} as ComponentMeta<typeof ActionSpacerComponent>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<any> = () => <ActionSpacerComponent />;

export const ActionSpacer = Template.bind({});
