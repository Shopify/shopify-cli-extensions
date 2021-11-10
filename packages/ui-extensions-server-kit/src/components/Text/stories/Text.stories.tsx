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
      <Text {...args}>This is some basic text</Text>
    </>
  );
};

export const Basic = Template.bind({});

Basic.args = {};
