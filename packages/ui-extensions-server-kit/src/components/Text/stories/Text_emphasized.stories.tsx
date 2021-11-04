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
      This is <Text {...args}>emphasized text</Text>.
    </>
  );
};

export const Emphasized = Template.bind({});

Emphasized.args = {
  emphasized: true,
};
