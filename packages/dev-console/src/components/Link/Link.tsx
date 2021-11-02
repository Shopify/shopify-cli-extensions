import React, {PropsWithChildren} from 'react';

import {classNames} from '../../utilities';

import styles from './Link.scss';

export interface LinkProps {
  /**
   * Specify the color of the link.
   * `monochrome` will take the color of its parent.
   */
  appearance?: 'monochrome';
  /**
   * Destination to navigate to. You **must** provide either this property, `onPress`,
   * or both.
   */
  to: string;
  /** Open the link in a new window or tab */
  external?: boolean;
  /**
   * Unique identifier. Typically used as a target for another component’s controls
   * to associate an accessible label with an action.
   */
  id?: string;
  /**
   * Indicate the text language. Useful when the text is in a different language than the rest of the page.
   * It will allow assistive technologies such as screen readers to invoke the correct pronunciation.
   * Reference of values: https://www.iana.org/assignments/language-subtag-registry/language-subtag-registry (see "subtag")
   */
  language?: string;
  /**
   * A label used for buyers using assistive technologies. When provided, any
   * 'children' supplied to this component are hidden from being seen for
   * accessibility purposes to prevent duplicate content from being read.
   */
  accessibilityLabel?: string;
}

/**
 * Link is used to navigate the buyer to another page or section within the same page.
 */
export function Link({
  appearance,
  accessibilityLabel,
  children,
  external,
  id,
  language,
  to,
}: PropsWithChildren<LinkProps>) {
  const openInNewTabProps = external && {
    target: '_blank',
    rel: 'noreferrer',
  };

  return (
    <a
      href={to}
      className={classNames(styles.Link, appearance === 'monochrome' && styles.Monochrome)}
      aria-label={accessibilityLabel}
      id={id}
      lang={language}
      {...openInNewTabProps}
    >
      {children}
    </a>
  );
}
