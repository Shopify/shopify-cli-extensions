import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';

import {Link} from './Link';
import styles from './Link.scss';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Components/Link',
  component: Link,
} as ComponentMeta<any>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<any> = (args) => (
  <>
    <p>
      This is an <code>external</code> link (opens in a new tab)
      <Link url="http://shopify.com" external>
        shopify
      </Link>
    </p>
    <p>
      This is a link that will open in this tab: <Link url="http://shopify.com">shopify</Link>
    </p>
    <p>
      This is a link with an <code>accessibilityLabel</code> and an <code>id</code>:{' '}
      <Link
        url="http://shopify.com"
        accessibilityLabel="this link goes to shopify.com"
        id="link-id-1"
      >
        shopify
      </Link>
    </p>
    <p style={{color: 'hotpink'}}>
      This is a <code>monochrome</code> link:{' '}
      <Link url="http://shopify.com" monochrome>
        shopify
      </Link>
    </p>
  </>
);

export const Base = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Base.args = {};
