import React, {PropsWithChildren} from 'react';

import {classNames} from '../../utilities';

import styles from './Link.scss';

export interface LinkProps {
  /** Descriptive text to be read to screenreaders */
  accessibilityLabel?: string;
  /** ID for the link */
  id?: string;
  /** Makes the link open in a new tab */
  external?: boolean;
  /** Makes the link color the same as the current text color and adds an underline */
  monochrome?: boolean;
  /** The url to link to */
  url?: string;
}

export function Link({
  accessibilityLabel,
  children,
  external,
  id,
  monochrome,
  url,
}: PropsWithChildren<LinkProps>) {
  const className = classNames(monochrome && styles.monochrome);

  const openInNewTabProps = external && {
    target: '_blank',
    rel: 'noreferrer',
  };

  return (
    <a
      href={url}
      className={className}
      aria-label={accessibilityLabel}
      id={id}
      {...openInNewTabProps}
    >
      {children}
    </a>
  );
}
