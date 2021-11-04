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
      <Link {...args}>External Link</Link> (opens in a new tab)
    </>
  );
};

export const External = Template.bind({});

External.args = {
  external: true,
  to: 'https://shopify.com',
};
