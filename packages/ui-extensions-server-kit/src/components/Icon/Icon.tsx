import React from 'react';
import {classNames, variationName} from 'utilities';

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

export type IconSource = React.SFC<React.SVGProps<SVGSVGElement>> | string;

export interface IconProps {
  /** The SVG contents to display in the icon (icons should fit in a 20 × 20 pixel viewBox) */
  source: IconSource;

  /**
   * Adjusts the size of the icon.
   * By default the icon will take up the entire width of its container
   * */
  size?: Size;

  /** The kind determines the color for the SVG fill. Recoloring SVG `source` of type string is not supported */
  kind?: Kind;

  /** Descriptive text to be read to screenreaders */
  accessibilityLabel?: string;
}

/** Icon is used to visually communicate core parts of the developer console and available actions.

*/
export function Icon({source, size, kind = 'base', accessibilityLabel}: IconProps) {
  if (kind && typeof source !== 'function') {
    // eslint-disable-next-line no-console
    console.warn(
      'Recoloring SVG `source` of type string is not supported. Set the intended color on your SVG instead.',
    );
  }

  const className = classNames(
    styles.Icon,
    kind && styles[variationName('color', kind)],
    size && styles[variationName('size', size)],
  );

  const SourceComponent = source;
  const contentMarkup =
    typeof source === 'function' ? (
      <SourceComponent className={styles.Svg} focusable={false} aria-hidden="true" />
    ) : (
      <img
        className={styles.Img}
        src={`data:image/svg+xml;utf8,${source}`}
        alt={accessibilityLabel}
        aria-hidden="true"
      />
    );

  return (
    <span className={className} aria-label={accessibilityLabel}>
      {contentMarkup}
    </span>
  );
}