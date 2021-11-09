import React from 'react';
import {mount} from '@shopify/react-testing';

import {ActionSet} from '../ActionSet';
import {mockExtensions} from '../../../testing/extensions';
import {RefreshAction, ToggleViewAction} from '../actions';
import {ActionSpacer} from '../ActionSpacer';

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
