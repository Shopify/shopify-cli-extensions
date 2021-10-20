import React from 'react';
import {mount} from '@shopify/react-testing';

import {Checkbox} from '../Checkbox';

describe('<Checkbox />', () => {
  const defaultLabel = 'Save this information for next time';

  it('renders an un-checked checkbox and label', () => {
    const checkbox = mount(<Checkbox>{defaultLabel}</Checkbox>);

    expect(checkbox).toContainReactComponent('input', {
      checked: false,
      type: 'checkbox',
    });

    expect(checkbox.find('label')).toContainReactText(defaultLabel);
  });

  it('renders a checked checkbox when the checked prop is provided and set to true', () => {
    const checkbox = mount(<Checkbox checked>{defaultLabel}</Checkbox>);
    expect(checkbox).toContainReactComponent('input', {
      checked: true,
      type: 'checkbox',
    });
  });

  it('renders a checked checkbox when the value prop is provided and set to true', () => {
    const checkbox = mount(<Checkbox value>{defaultLabel}</Checkbox>);
    expect(checkbox).toContainReactComponent('input', {
      checked: true,
      type: 'checkbox',
    });
  });

  it('renders a disabled checkbox when the disabled prop is provided and set to true', () => {
    const checkbox = mount(<Checkbox disabled>{defaultLabel}</Checkbox>);
    expect(checkbox).toContainReactComponent('input', {
      disabled: true,
      type: 'checkbox',
    });
  });

  it('calls the onChange callback when the checkbox is checked and unchecked', () => {
    const onChangeSpy = jest.fn();
    const checkbox = mount(<Checkbox onChange={onChangeSpy}>{defaultLabel}</Checkbox>);
    checkbox.find('input')!.trigger('onChange', {
      currentTarget: {checked: true},
    });
    expect(onChangeSpy).toHaveBeenCalledWith(true);

    checkbox.find('input')!.trigger('onChange', {
      currentTarget: {checked: false},
    });
    expect(onChangeSpy).toHaveBeenCalledWith(false);
  });

  describe('accessibilityLabel', () => {
    it('adds an aria-label to the label when the accessibilityLabel is set', () => {
      const accessibilityLabelContent = 'Accessibility content';

      const checkbox = mount(
        <Checkbox accessibilityLabel={accessibilityLabelContent}>{defaultLabel}</Checkbox>,
      );

      expect(checkbox).toContainReactComponent('label', {
        'aria-label': accessibilityLabelContent,
      });
    });

    it('does not add aria-label to the label when accessibilityLabel is not set', () => {
      const accessibilityLabelContent = 'Accessibility content';

      const checkbox = mount(<Checkbox>{defaultLabel}</Checkbox>);

      expect(checkbox).not.toContainReactComponent('label', {
        'aria-label': accessibilityLabelContent,
      });
    });
  });
});
