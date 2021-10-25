import React, {forwardRef, PropsWithChildren, ReactNode, useCallback} from 'react';

import styles from './Button.scss';

export type Size = 'base' | 'large' | 'extraLarge';
export type Kind = 'primary' | 'secondary' | 'plain';
export type ButtonStyle = 'monochrome' | 'critical';
export type InlineAlignment = 'leading' | 'center' | 'trailing';

export interface ButtonProps {
  /**
   * The type of button that will be rendered. The visual of these buttons are controlled
   * by merchants through the Branding API.
   * - 'primary': button used for main actions. Ex: "Continue to next step"
   * - 'secondary': button used for secondary actions not blocking user progress. Ex: "Download Shop app"
   * - 'plain': renders a button that visually looks like a Link
   * @defaultValue 'primary'
   */
  kind?: Kind;
  /**
   * Changes the size of the button
   * @defaultValue 'base'
   */
  size?: Size;
  /**
   * Specify the color treatment of the Button. By default, it will use the "Primary / Secondary Action" colors.
   * - 'monochrome' will take the color of its parent.
   * - 'critical' will take the critical color.
   */
  appearance?: ButtonStyle;

  /**
   * Whether the button should fill all available inline space.
   */
  fill?: boolean;
  /**
   * Specifies the inline alignment of the content.
   * @defaultValue `center`
   */
  inlineAlignment?: InlineAlignment;
  /**
   * Replaces content with a loading indicator
   */
  loading?: boolean;
  /**
   * Accessible label for the loading indicator when user prefers reduced motion
   */
  loadingLabel?: string;
  /**
   * A label used for buyers using assistive technologies. When provided, any
   * 'children' supplied to this component are hidden from being seen for
   * accessibility purposes to prevent duplicate content from being read.
   */
  accessibilityLabel?: string;
  /**
   * Disables the button, disallowing any interaction
   */
  disabled?: boolean;
  /**
   * Callback when pressed
   */
  onPress?(): void;
}

export function Button() {}
