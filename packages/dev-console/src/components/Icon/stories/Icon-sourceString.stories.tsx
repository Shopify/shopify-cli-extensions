import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';

import {Icon} from '../Icon';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Components/Icon',
  component: Icon,
  argTypes: {
    source: {
      control: false,
    },
    kind: {
      control: false,
    },
  },
} as ComponentMeta<typeof Icon>;

const rawCancel = `<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M11.414 10l4.293-4.293a.999.999 0 10-1.414-1.414L10 8.586 5.707 4.293a.999.999 0 10-1.414 1.414L8.586 10l-4.293 4.293a.999.999 0 101.414 1.414L10 11.414l4.293 4.293a.997.997 0 001.414 0 .999.999 0 000-1.414L11.414 10z" /></svg>`;
const sourceStringExample = `
const rawCancel = <svg viewBox="0 0 20 20">...</svg>;
<Icon source={rawCancel} />
`;

const Template: ComponentStory<typeof Icon> = (args) => (
  <>
    <div>Pass an svg element as a string. Example:</div>
    <pre>
      <code>{sourceStringExample}</code>
    </pre>
    <Icon {...args} />
  </>
);

export const SourceString = Template.bind({});
SourceString.args = {
  source: rawCancel,
};
