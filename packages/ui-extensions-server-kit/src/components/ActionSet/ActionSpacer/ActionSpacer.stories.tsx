import React, {useState} from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';

import {Action} from '../Action';
import {RefreshMinor, HideMinor} from '../../Icon';
import styles from '../../../../.storybook/styles.module.scss';

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

  return (
    <>
      <div style={{display: 'flex', flexDirection: 'row', gap: '4px', marginBottom: '16px'}}>
        <Action source={RefreshMinor} onAction={() => {}} accessibilityLabel="Refresh" />
        {hasSpacer && <ActionSpacerComponent />}
        <Action source={HideMinor} onAction={() => {}} accessibilityLabel="Hide" />
      </div>
      <button type="button" className={styles.Button} onClick={insertActionSpacer}>
        Toggle ActionSpacer
      </button>
    </>
  );
};

export const ActionSpacer = Template.bind({});
