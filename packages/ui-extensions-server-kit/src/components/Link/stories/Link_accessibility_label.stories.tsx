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
      <Link {...args}>Visit Shopify.com</Link> (inspect for accessibility label)
    </>
  );
};

export const AccessibilityLabel = Template.bind({});

AccessibilityLabel.args = {
  accessibilityLabel: 'Visit Shopify.com',
  to: 'https://shopify.com',
};
