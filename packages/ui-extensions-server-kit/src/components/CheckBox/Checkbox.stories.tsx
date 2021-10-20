import React, {useState} from 'react';
import {Meta, Story} from '@storybook/react/types-6-0';

import {Checkbox, CheckboxProps} from './Checkbox';

export default {
  title: 'Components/Checkbox',
  component: Checkbox,
} as Meta;

const Template: Story<CheckboxProps> = (args) => {
  const [checked, setChecked] = useState(args.checked);
  return <Checkbox {...args} checked={checked} onChange={setChecked} />;
};

export const Unchecked = Template.bind({});

Unchecked.args = {
  children: 'unchecked',
  checked: false,
};

export const Checked = Template.bind({});

Checked.args = {
  children: 'checked',
  checked: true,
};

export const Disabled = Template.bind({});

Disabled.args = {
  children: 'disabled checkbox',
  checked: true,
  disabled: true,
};

export const LongLabel = Template.bind({});

LongLabel.args = {
  children:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse bibendum luctus arcu quis fermentum. Mauris ac cursus augue, nec efficitur neque. Mauris finibus erat sit amet augue facilisi',
  checked: true,
  disabled: false,
};
