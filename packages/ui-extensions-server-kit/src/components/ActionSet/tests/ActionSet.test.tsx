import React from 'react';

import {ActionSet} from '../ActionSet';
import {ActionSpacer} from '../ActionSpacer';
import {RefreshAction, ToggleViewAction} from '../actions';
import {mockExtensions, mount} from '../../../testing';

describe('<ActionSet />', () => {
  const defaultProps = {
    extensions: mockExtensions(),
  };

  it('renders refresh action', () => {
    const actionSet = mount(
      <ActionSet {...defaultProps}>
        <RefreshAction />
      </ActionSet>,
    );

    expect(actionSet).toContainReactComponent(RefreshAction);
  });

  it('renders toggle view action', () => {
    const actionSet = mount(
      <ActionSet {...defaultProps}>
        <ToggleViewAction />
      </ActionSet>,
    );

    expect(actionSet).toContainReactComponent(ToggleViewAction);
  });

  it('renders refresh and toggle view action', () => {
    const actionSet = mount(
      <ActionSet {...defaultProps}>
        <RefreshAction />
        <ToggleViewAction />
      </ActionSet>,
    );

    expect(actionSet).toContainReactComponent(ToggleViewAction);
    expect(actionSet).toContainReactComponent(RefreshAction);
  });

  it('renders refresh and toggle view action, and action spacer', () => {
    const actionSet = mount(
      <ActionSet {...defaultProps}>
        <RefreshAction />
        <ActionSpacer />
        <ToggleViewAction />
      </ActionSet>,
    );

    expect(actionSet).toContainReactComponent(ToggleViewAction);
    expect(actionSet).toContainReactComponent(RefreshAction);
    expect(actionSet).toContainReactComponent(ActionSpacer);
  });
});
