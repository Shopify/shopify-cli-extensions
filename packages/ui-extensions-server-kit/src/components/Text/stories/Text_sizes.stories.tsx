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
      This is <Text {...args}>{args.size} text</Text>.
    </>
  );
};

export const ExtraSmall = Template.bind({});

ExtraSmall.args = {
  size: 'extraSmall',
};

export const Small = Template.bind({});

Small.args = {
  size: 'small',
};

export const Medium = Template.bind({});

Medium.args = {
  size: 'medium',
};

export const Large = Template.bind({});

Large.args = {
  size: 'large',
};

export const ExtraLarge = Template.bind({});

ExtraLarge.args = {
  size: 'extraLarge',
};
