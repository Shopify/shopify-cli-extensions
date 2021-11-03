import React from 'react';
import {Meta, Story} from '@storybook/react/types-6-0';

import {Link, LinkProps} from '../Link';

const meta = {
  component: Link,
  title: 'components/Link',
} as Meta;

export default meta;

const Template: Story<LinkProps> = (args) => {
  return (
    <>
      <Link {...args}>Visit Shopify.com</Link> (opens in this tab)
    </>
  );
};

export const Basic = Template.bind({});

Basic.args = {
  to: 'https://shopify.com',
};
