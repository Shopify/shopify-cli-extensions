import React, {useMemo, useState} from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import {action} from '@storybook/addon-actions';

import {ExtensionPayloadContext} from '../../../../utilities/extensionPayload';
import {DevServerContext} from '../../../../state/context';
import {mockExtensions} from '../../../../testing';

import {ToggleViewAction} from './ToggleViewAction';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Components/Action',
  component: ToggleViewAction,
} as ComponentMeta<typeof ToggleViewAction>;

const send = action('send');

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<any> = () => {
  const [extensions, setExtensions] = useState(() => mockExtensions());
  const mockDevServerContext = useMemo(
    () =>
      ({
        send: (...args: any[]) => {
          extensions[0].development.hidden = !extensions[0].development.hidden;
          setExtensions([...extensions]);
          send(...args);
        },
      } as any),
    [extensions],
  );

  return (
    <DevServerContext.Provider value={mockDevServerContext}>
      <ExtensionPayloadContext.Provider value={extensions}>
        <ToggleViewAction />
      </ExtensionPayloadContext.Provider>
    </DevServerContext.Provider>
  );
};

export const ToggleView = Template.bind({});
