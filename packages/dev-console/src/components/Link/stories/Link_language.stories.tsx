import React from 'react';
import {Meta, Story} from '@storybook/react/types-6-0';

import {Link, LinkProps} from '..';

const meta = {
  component: Link,
  title: 'components/Link',
} as Meta;

export default meta;

const Template: Story<LinkProps> = (args) => {
  return (
    <>
      <Link {...args}>enlace Español</Link> (inspect for lang attribute)
    </>
  );
};

export const Language = Template.bind({});

Language.args = {
  language: 'es',
  to: 'https://shopify.com',
};
