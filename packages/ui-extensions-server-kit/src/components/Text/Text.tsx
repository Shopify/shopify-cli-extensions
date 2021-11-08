import React, {PropsWithChildren} from 'react';

import {classNames} from '../../utilities';

import styles from './Text.scss';

export interface TextProps {
  /* Changes the visual appearance */
  appearance?: 'critical' | 'code' | 'subdued' | 'success';

  /* Use to emphasize text that is more important than other nearby text */
  emphasized?: boolean;

  /**
   * Unique identifier. Typically used as a target for another component’s controls
   * to associate an accessible label with an action.
   */
  id?: string;

  /* Size of the text */
  size?: 'extraSmall' | 'small' | 'base' | 'medium' | 'large' | 'extraLarge';

  /* Use for bold text that is more important than other nearby text */
  strong?: boolean;
}

/**
 * Text is used to decorate inline text elements
 */
export function Text({
  appearance,
  children,
  emphasized,
  id,
  size,
  strong,
}: PropsWithChildren<TextProps>) {
  const className = classNames(
    appearance ? styles[sizeClassName(appearance)] : null,
    emphasized && styles.Emphasized,
    size && styles[sizeClassName(size)],
    strong && styles.Strong,
  );

  return (
    <span className={className} data-id={id}>
      {children}
    </span>
  );
}

const sizeClassName = (prop: string) => `${prop.slice(0, 1).toUpperCase()}${prop.slice(1)}`;
