import React from 'react';
import {mount} from '@shopify/react-testing';
import '@shopify/react-testing/matchers';

import {Text} from './Text';

describe('<Text />', () => {
  it('renders a span with text', () => {
    const text = mount(<Text>basic text</Text>);

    expect(text).toContainReactComponent('span', {children: 'basic text'});
  });

  describe('Appearance', () => {
    it('renders "code" style of text', () => {
      const codeText = mount(<Text appearance="code">code text</Text>);

      expect(codeText).toContainReactComponent('span', {className: 'code'});
    });

    it('renders "critical" style of text', () => {
      const criticalText = mount(<Text appearance="critical">critical text</Text>);

      expect(criticalText).toContainReactComponent('span', {className: 'critical'});
    });

    it('renders "success" style of text', () => {
      const successText = mount(<Text appearance="success">success text</Text>);

      expect(successText).toContainReactComponent('span', {className: 'success'});
    });

    it('renders "subdued" style of text', () => {
      const subduedText = mount(<Text appearance="subdued">subdued text</Text>);

      expect(subduedText).toContainReactComponent('span', {className: 'subdued'});
    });
  });

  it('renders emphasized text', () => {
    const emphasizedText = mount(<Text emphasized>emphasized text</Text>);

    expect(emphasizedText).toContainReactComponent('span', {className: 'emphasized'});
  });

  describe('Size', () => {
    it('renders extraSmall text', () => {
      const extraSmallText = mount(<Text size="extraSmall">extraSmall text</Text>);

      expect(extraSmallText).toContainReactComponent('span', {className: 'extraSmall'});
    });

    it('renders small text', () => {
      const smallText = mount(<Text size="small">small text</Text>);

      expect(smallText).toContainReactComponent('span', {className: 'small'});
    });

    it('renders medium text', () => {
      const mediumText = mount(<Text size="medium">medium text</Text>);

      expect(mediumText).toContainReactComponent('span', {className: 'medium'});
    });

    it('renders large text', () => {
      const largeText = mount(<Text size="large">large text</Text>);

      expect(largeText).toContainReactComponent('span', {className: 'large'});
    });

    it('renders extraLarge text', () => {
      const extraLargeText = mount(<Text size="extraLarge">extraLarge text</Text>);

      expect(extraLargeText).toContainReactComponent('span', {className: 'extraLarge'});
    });
  });

  it('renders strong text', () => {
    const strongText = mount(<Text strong>strong text</Text>);

    expect(strongText).toContainReactComponent('span', {className: 'strong'});
  });
});
