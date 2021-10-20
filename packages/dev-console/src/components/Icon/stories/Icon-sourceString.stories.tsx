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

const rawCancel = `<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M17.928 9.628C17.837 9.399 15.611 4 10 4S2.162 9.399 2.07 9.628a1.017 1.017 0 000 .744C2.163 10.601 4.389 16 10 16c5.611 0 7.837-5.399 7.928-5.628a1.017 1.017 0 000-.744zM10 14a4 4 0 110-8 4 4 0 010 8zm0-6a2 2 0 10.002 4.001A2 2 0 009.999 8z" fill="white" /></svg>`;
const sourceStringExample = `
const rawCancel = <svg viewBox="0 0 20 20" fill="white">...</svg>;
<Icon source={rawCancel} />
`;

const Template: ComponentStory<typeof Icon> = (args) => (
  <>
    <p>Pass an SVG element as a string. Example:</p>
    <pre>
      <code>{sourceStringExample}</code>
    </pre>
    <br />
    <Icon {...args} />
  </>
);

export const SourceString = Template.bind({});
SourceString.args = {
  source: rawCancel,
};
