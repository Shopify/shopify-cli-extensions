import React, {PropsWithChildren} from 'react';

import {classNames, variationName, useUniqueId} from '../../utilities';
import {Icon, TickSmallMinor} from '../Icon';

import styles from './Checkbox.scss';

interface CheckboxPropsBase {
  /** ID for form input */
  id?: string;

  /** Name for form input */
  name?: string;

  /** aria-label for the input. It is recommended to have an accessibility label if you have no label */
  accessibilityLabel?: string;

  /** Disable input */
  disabled?: boolean;

  /** Checkbox is selected */
  checked?: boolean;

  /** Same as checked */
  value?: boolean;

  /** Callback when checkbox is toggled */
  onChange?: (value: boolean) => void;
}

export type CheckboxProps = PropsWithChildren<CheckboxPropsBase>;

export function Checkbox({
  id: explicitId,
  name,
  accessibilityLabel,
  disabled,
  children,
  ...rest
}: CheckboxProps) {
  const id = useUniqueId('DevConsole-Checkbox', explicitId);

  const labelClassName = classNames(styles.Label, disabled && styles['Label-isDisabled']);

  return (
    <div className={styles.Wrapper}>
      <CheckboxControl id={id} name={name} disabled={disabled} {...rest} />
      <label
        htmlFor={id}
        className={labelClassName}
        aria-label={accessibilityLabel ? accessibilityLabel : undefined}
      >
        {children}
      </label>
      {/* {errorMarkup} */}
    </div>
  );
}

interface ControlProps
  extends Omit<CheckboxPropsBase, 'id' | 'error' | 'children' | 'accessibilityLabel'> {
  id: string;
}

export function CheckboxControl({
  id,
  name,
  value = false,
  checked = value,
  disabled,
  onChange,
}: ControlProps) {
  const className = classNames(
    styles.Input,
    disabled && styles['Input-isDisabled'],
    styles[variationName('Input-borderColor', 'base')],
  );

  return (
    <div className={styles.Checkbox}>
      <input
        type="checkbox"
        id={id}
        name={name}
        checked={checked}
        disabled={disabled}
        onChange={({currentTarget}) => {
          onChange?.(currentTarget.checked);
        }}
        className={className}
      />
      <div className={styles.Icon}>
        <Icon source={TickSmallMinor} />
      </div>
    </div>
  );
}
