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
    <span style={{color: 'yellow'}}>
      Learn more about our <Link {...args}>shipping policies</Link> (monochrome link)
    </span>
  );
};

export const Monochrome = Template.bind({});

Monochrome.args = {
  appearance: 'monochrome',
  to: 'https://shopify.com',
};
