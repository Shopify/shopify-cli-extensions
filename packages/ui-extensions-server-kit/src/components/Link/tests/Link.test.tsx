import React from 'react';
import {mount} from '@shopify/react-testing';
import '@shopify/react-testing/matchers';

import {Link, LinkProps} from '../Link';

import styles from './Link.scss';

describe('<Link />', () => {
  const to: LinkProps['to'] = 'https://example.com';

  it('renders an an anchor', () => {
    const link = mount(<Link to={to} />);

    expect(link).toContainReactComponent('a', {href: 'https://example.com'});
  });

  it('opens to a new tab when "external" is true', () => {
    const link = mount(<Link to={to} external />);

    expect(link).toContainReactComponent('a', {target: '_blank', rel: 'noreferrer'});
  });

  it('renders an anchor with aria-label when provided', () => {
    const accessibilityLabel = 'Accessibility label';
    const link = mount(<Link to={to} accessibilityLabel={accessibilityLabel} />);

    expect(link).toContainReactComponent('a', {
      'aria-label': accessibilityLabel,
    });
  });

  it('does not render with aria-label when not provided', () => {
    const link = mount(<Link to={to} accessibilityLabel={undefined} />);

    expect(link).toContainReactComponent('a', {
      'aria-label': undefined,
    });
  });

  it('renders with a lang attribute when language is provided', () => {
    const link = mount(<Link to={to} language="fr" />);

    expect(link).toContainReactComponent('a', {
      lang: 'fr',
    });
  });

  it('renders a monochrome link when appearance="monochrome"', () => {
    const link = mount(<Link to={to} appearance="monochrome" />);

    expect(link).toContainReactComponent('a', {
      className: `${styles.link} ${styles.monochrome}`,
    });
  });
});
