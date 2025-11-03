import { FocusTrap, Textarea, type TextareaProps } from '@mantine/core';
import cx from 'clsx';
import type { KeyboardEventHandler } from 'react';
import { usePromptInput } from './Provider';

import classes from './promptInput.module.css';

const handleKeyDown: KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
  if (e.key === 'Enter') {
    // Don't submit if IME composition is in progress
    if (e.nativeEvent.isComposing) return;

    // Allow newline
    if (e.shiftKey) return;

    // Submit on Enter (without Shift)
    e.preventDefault();
    const form = e.currentTarget.form;
    if (form) form.requestSubmit();
  }
};

export const Input = ({ children, className, ...props }: TextareaProps) => {
  const { disabled, form, variant, size, radius } = usePromptInput();

  return (
    <FocusTrap active={!disabled}>
      {children || (
        <Textarea
          placeholder="Введите сообщение"
          rows={5}
          size={size}
          variant={variant}
          radius={radius}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          className={cx(classes.input, className)}
          key={form.key('prompt')}
          {...form.getInputProps('prompt')}
          {...props}
        />
      )}
    </FocusTrap>
  );
};
