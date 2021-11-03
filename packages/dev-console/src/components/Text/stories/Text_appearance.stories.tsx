import React from 'react';
import {Meta, Story} from '@storybook/react/types-6-0';

import {Text, TextProps} from '../Text';

const meta = {
  component: Text,
  title: 'components/Text',
} as Meta;

export default meta;

const Template: Story<TextProps> = (args) => {
  return (
    <>
      This is <Text {...args}>{args.appearance} text</Text>.
    </>
  );
};

export const Code = Template.bind({});

Code.args = {
  appearance: 'code',
};

export const Critical = Template.bind({});

Critical.args = {
  appearance: 'critical',
};

export const Success = Template.bind({});

Success.args = {
  appearance: 'success',
};

export const Subdued = Template.bind({});

Subdued.args = {
  appearance: 'subdued',
};
