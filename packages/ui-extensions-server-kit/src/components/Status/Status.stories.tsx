import React from 'react';
import {Meta, Story} from '@storybook/react/types-6-0';

import {Status, StatusType, StatusProps} from './Status';

export default {
  title: 'dev-console/Status',
  component: Status,
} as Meta;

const Template: Story<StatusProps> = (args) => <Status {...args} />;

export const Connected = Template.bind({});

Connected.args = {
  status: StatusType.Connected,
};

export const Disconnected = Template.bind({});

Disconnected.args = {
  status: StatusType.Disconnected,
};

export const BuildError = Template.bind({});

BuildError.args = {
  status: StatusType.BuildError,
};
