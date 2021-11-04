import React, {useState} from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';

import {Action} from '../Action';
import {RefreshMinor, HideMinor} from '../../Icon';
import styles from '../../../../.storybook/styles.module.scss';
import {ActionSet} from '../ActionSet';
import {mockExtensions} from '../../../testing';

import {ActionSpacer as ActionSpacerComponent} from './ActionSpacer';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Components/ActionSpacer',
  component: ActionSpacerComponent,
} as ComponentMeta<typeof ActionSpacerComponent>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<any> = () => {
  const [hasSpacer, setSpacer] = useState(false);
  const insertActionSpacer = () => setSpacer((state) => !state);
  const extensions = mockExtensions();
  return (
    <>
      <ActionSet extensions={extensions}>
        <Action source={RefreshMinor} onAction={() => {}} accessibilityLabel="Refresh" />
        {hasSpacer && <ActionSpacerComponent />}
        <Action source={HideMinor} onAction={() => {}} accessibilityLabel="Hide" />
      </ActionSet>
      <div style={{textAlign: 'right', margin: '8px 0px'}}>
        <button type="button" className={styles.Button} onClick={insertActionSpacer}>
          Toggle ActionSpacer
        </button>
      </div>
    </>
  );
};

export const ActionSpacer = Template.bind({});
