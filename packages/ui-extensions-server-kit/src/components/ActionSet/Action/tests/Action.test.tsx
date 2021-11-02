import React from 'react';
import {mount} from '@shopify/react-testing';

import {Icon, ViewMinor} from '../../../Icon';
import styles from '../Action.scss';
import {Action} from '..';

describe('<Action />', () => {
  const defaultProps = {
    source: ViewMinor,
    accessibilityLabel: 'testing',
    onAction: () => {},
  };

  it('renders an action with an icon', () => {
    const action = mount(<Action {...defaultProps} />);
    expect(action).toContainReactComponent(Icon, {
      source: defaultProps.source,
    });
  });

  it('calls the onAction callback when the icon is pressed', () => {
    const onActionSpy = jest.fn();
    const action = mount(<Action {...defaultProps} onAction={onActionSpy} />);
    const mouseEvent = {stopPropagation: jest.fn()};
    action.find('button')!.trigger('onClick', mouseEvent);

    expect(onActionSpy).toHaveBeenCalled();

    // need to stop propagation so that ExtensionRow doesn't register press event.
    expect(mouseEvent.stopPropagation).toHaveBeenCalled();
  });

  it('adds an aria-label to the label when the accessibilityLabel is set', () => {
    const action = mount(<Action {...defaultProps} />);

    expect(action).toContainReactComponent(Icon, {
      accessibilityLabel: defaultProps.accessibilityLabel,
    });
  });

  it('hides Action visibility if hidden is set to true', () => {
    const action = mount(<Action {...defaultProps} hidden />);

    expect(action).toContainReactComponent('button', {
      className: styles.Hidden,
    });
  });
});
