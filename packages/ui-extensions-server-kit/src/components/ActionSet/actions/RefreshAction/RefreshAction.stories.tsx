import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import {action} from '@storybook/addon-actions';

import {ExtensionPayloadContext} from '../../../../utilities/extensionPayload';
import {DevServerContext} from '../../../../state/context';
import {mockExtensions} from '../../../../testing';

import {RefreshAction} from './RefreshAction';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Components/Action',
  component: RefreshAction,
} as ComponentMeta<typeof RefreshAction>;

const mockDevServerContext = {
  send: action('send'),
} as any;
const extensions = mockExtensions();

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<any> = () => (
  <DevServerContext.Provider value={mockDevServerContext}>
    <ExtensionPayloadContext.Provider value={extensions}>
      <RefreshAction />
    </ExtensionPayloadContext.Provider>
  </DevServerContext.Provider>
);

export const Refresh = Template.bind({});
