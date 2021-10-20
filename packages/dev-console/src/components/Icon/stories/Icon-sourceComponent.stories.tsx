import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';

import {CancelSmallMinor, HideMinor, RefreshMinor, ToolsMajor, ViewMinor} from '../icons';
import {Icon} from '../Icon';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Components/Icon',
  component: Icon,
  argTypes: {
    source: {
      control: false,
    },
  },
} as ComponentMeta<typeof Icon>;

const icons: React.SFC<React.SVGProps<SVGSVGElement>>[] = [
  CancelSmallMinor,
  HideMinor,
  RefreshMinor,
  ToolsMajor,
  ViewMinor,
];

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<any> = (args) => (
  <div style={{display: 'flex', gap: '1rem'}}>
    {icons.map((IconComponent) => (
      <div
        style={{display: 'inline-flex', flexDirection: 'column'}}
        key={IconComponent.displayName}
      >
        <div>{IconComponent.displayName}</div>
        <Icon {...args} source={IconComponent} />
      </div>
    ))}
  </div>
);

export const SourceComponent = Template.bind({});
SourceComponent.args = {};
