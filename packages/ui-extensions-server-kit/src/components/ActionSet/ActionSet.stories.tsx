import React, {useState, useMemo} from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import {action} from '@storybook/addon-actions';

import {ExtensionPayload} from '../../types';
import {mockExtensions} from '../../testing';
import {DevServerContext} from '../../state/context';

import {RefreshAction, ToggleViewAction} from './actions';
import {ActionSet} from './ActionSet';
import {ActionSpacer} from './ActionSpacer';
import {Action} from './Action';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Components/ActionSet',
  component: ActionSet,
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
const mockRereshContext = {
  send: action('send'),
} as any;
const send = action('send');

export const Base = () => {
  const [extensions, setExtensions] = useState(() => mockExtensions());
  const mockToggleViewContext = useMemo(
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
    <div style={containerStyle}>
      <ActionSet extensions={extensions}>
        <DevServerContext.Provider value={mockRereshContext}>
          <RefreshAction />
        </DevServerContext.Provider>
        <DevServerContext.Provider value={mockToggleViewContext}>
          <ToggleViewAction />
        </DevServerContext.Provider>
      </ActionSet>
    </div>
  );
};

export const WithActionSpacer = () => {
  const [extensions, setExtensions] = useState(() => mockExtensions());
  const mockToggleViewContext = useMemo(
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
    <div style={containerStyle}>
      <ActionSet extensions={extensions}>
        <DevServerContext.Provider value={mockRereshContext}>
          <RefreshAction />
        </DevServerContext.Provider>
        <ActionSpacer />
        <DevServerContext.Provider value={mockToggleViewContext}>
          <ToggleViewAction />
        </DevServerContext.Provider>
      </ActionSet>
    </div>
  );
};
