import React, {useState, useMemo} from 'react';
import {ComponentMeta} from '@storybook/react';
import {action} from '@storybook/addon-actions';
import {ExtensionPayload} from 'types';

import {ToolsMajor} from '../Icon';
import {DevServerCall} from '../../types';
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
  subcomponents: {Action, ActionSpacer},
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
const send = action('send');

function useMockDevServerContext(
  extensions: ExtensionPayload[],
  setExtensions: (extensions: ExtensionPayload[]) => void,
) {
  return useMemo(
    () =>
      ({
        send: (callData: DevServerCall) => {
          if (callData.event === 'update') {
            extensions[0].development.hidden = !extensions[0].development.hidden;
            setExtensions([...extensions]);
          }
          send(callData);
        },
      } as any),
    [extensions, setExtensions],
  );
}

export const Base = () => {
  const [extensions, setExtensions] = useState(() => mockExtensions());
  const context = useMockDevServerContext(extensions, setExtensions);

  return (
    <div style={containerStyle}>
      <DevServerContext.Provider value={context}>
        <ActionSet extensions={extensions}>
          <RefreshAction />
          <ToggleViewAction />
        </ActionSet>
      </DevServerContext.Provider>
    </div>
  );
};

export const WithActionSpacer = () => {
  const [extensions, setExtensions] = useState(() => mockExtensions());
  const context = useMockDevServerContext(extensions, setExtensions);

  return (
    <div style={containerStyle}>
      <DevServerContext.Provider value={context}>
        <ActionSet extensions={extensions}>
          <RefreshAction />
          <ActionSpacer />
          <ToggleViewAction />
        </ActionSet>
      </DevServerContext.Provider>
    </div>
  );
};

const onAction = action('onAction');
export const WithCustomAction = () => {
  const [extensions] = useState(() => mockExtensions());

  return (
    <div style={containerStyle}>
      <ActionSet extensions={extensions}>
        <Action source={ToolsMajor} accessibilityLabel="custom action" onAction={onAction} />
      </ActionSet>
    </div>
  );
};
