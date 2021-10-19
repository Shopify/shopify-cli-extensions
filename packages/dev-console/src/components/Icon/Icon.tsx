import React from 'react';

import {classNames, variationName} from '../../utilities';

import styles from './Icon.scss';

/**
 * Accent:
 * Use to convey emphasis and draw attention to the icon.
 *
 * Interactive:
 * Use to convey that the icon is pressable, hoverable or otherwise interactive.
 *
 * Subdued:
 * Use to convey a subdued or disabled state for the icon.
 *
 * Info:
 * Use to convey icon is informative or has information.
 *
 * Success:
 * Use to convey a successful interaction.
 *
 * Warning:
 * Use to convey something needs attention or an action needs to be taken.
 *
 * Critical:
 * Use to convey a problem has arisen.
 */
export type Kind =
  | 'base'
  | 'subdued'
  | 'critical'
  | 'interactive'
  | 'warning'
  | 'highlight'
  | 'success'
  | 'primary';

type Size = 'small' | 'base' | 'large';

type BuiltInIcon = 'refresh' | 'view' | 'hide' | 'tools';

export type IconSource = React.SFC<React.SVGProps<SVGSVGElement>>;

export interface IconProps {
  /** The SVG contents to display in the icon (icons should fit in a 20 × 20 pixel viewBox) */
  source: IconSource;

  /**
   * Adjusts the size of the icon.
   * By default the icon will take up the entire width of its container
   * */
  size?: Size;

  /** The kind determines the color for the SVG fill */
  kind?: Kind;

  /** Descriptive text to be read to screenreaders */
  accessibilityLabel?: string;
}

export function Icon({source, size, kind, accessibilityLabel}: IconProps) {
  if (kind && typeof source !== 'function') {
    // eslint-disable-next-line no-console
    console.warn(
      'Recoloring external SVGs is not supported. Set the intended color on your SVG instead.',
    );
  }

  const className = classNames(
    styles.Icon,
    kind && styles[variationName('color', kind)],
    kind && styles.applyKind,
    size && styles[variationName('size', size)],
  );

  const SourceComponent = source;
  const contentMarkup = (
    <SourceComponent className={styles.Svg} focusable="false" aria-hidden="true" />
  );

  return (
    <span className={className} aria-label={accessibilityLabel}>
      {contentMarkup}
    </span>
  );
}
