import React, {PropsWithChildren, forwardRef, useRef, useImperativeHandle, useState} from 'react';
import {TickSmallMinor} from '@shopify/polaris-icons';
import {classNames} from '@shopify/css-utilities';

import {useUniqueId} from '../hooks/useUniqueId';
import {Choice} from '../Choice';
import {Icon} from '../Icon';

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

export interface CheckboxHandles {
  focus(): void;
}

export type CheckboxProps = PropsWithChildren<CheckboxPropsBase>;

export const Checkbox = forwardRef<CheckboxHandles, CheckboxProps>(function Checkbox(
  {
    checked = false,
    value = checked,
    disabled,
    id: explicitId,
    children,
    name,
    onChange,
  }: CheckboxProps,
  ref,
) {
  const inputNode = useRef<HTMLInputElement>(null);
  const id = useUniqueId('DevConsole-Checkbox', explicitId);
  const [keyFocused, setKeyFocused] = useState(false);

  useImperativeHandle(ref, () => ({
    focus: () => {
      if (inputNode.current) {
        inputNode.current.focus();
      }
    },
  }));

  const handleInput = () => {
    if (onChange == null || inputNode.current == null || disabled) {
      return;
    }
    onChange(!inputNode.current.checked);
    inputNode.current.focus();
  };

  const handleKeyUp = (event: React.KeyboardEvent) => {
    if (!keyFocused) {
      setKeyFocused(true);
    }
    if (event.key === 'Space') {
      handleInput();
    }
  };

  const isChecked = Boolean(checked || value);

  const inputClassName = classNames(styles.Input, keyFocused && styles.keyFocused);

  return (
    /* eslint-disable jsx-a11y/no-redundant-roles */
    <Choice id={id} label={children} disabled={disabled} onClick={handleInput}>
      <span className={styles.Checkbox}>
        <input
          onKeyUp={handleKeyUp}
          ref={inputNode}
          id={id}
          name={name}
          type="checkbox"
          checked={isChecked}
          disabled={disabled}
          className={inputClassName}
          onClick={stopPropagation}
          onFocus={() => setKeyFocused(true)}
          onBlur={() => setKeyFocused(false)}
          onChange={noop}
          role="checkbox"
          aria-checked={isChecked}
        />
        <span className={styles.Backdrop} />
        <span className={styles.Icon}>
          <Icon source={TickSmallMinor} />
        </span>
      </span>
    </Choice>
    /* eslint-enable jsx-a11y/no-redundant-roles */
  );
});

function noop() {}

function stopPropagation<T>(event: React.MouseEvent<T>) {
  event.stopPropagation();
}
