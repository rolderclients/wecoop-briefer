import {
  ActionIcon,
  Box,
  type BoxProps,
  FocusTrap,
  Group,
  getRadius,
  type InputVariant,
  type MantineRadius,
  Textarea,
  type TextareaProps,
} from '@mantine/core';
import { isNotEmpty, useForm } from '@mantine/form';
import { IconArrowBigUp } from '@tabler/icons-react';
import cx from 'clsx';
import type { KeyboardEventHandler } from 'react';

import classes from './promptInput.module.css';

interface PromptInputProps extends BoxProps {
  // onSubmit: (prompt: string) => void;
  disabled?: boolean;
  variant?: InputVariant;
  radius?: MantineRadius;
  textAreaProps?: TextareaProps;
}

export const PromptInput = ({
  className,
  disabled,
  variant = 'default',
  textAreaProps,
  ...props
}: PromptInputProps) => {
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: { prompt: '' },

    validate: {
      prompt: isNotEmpty(),
    },
  });

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

  return (
    <form
      onSubmit={form.onSubmit((values) => {
        console.log(values);
        if (values.prompt.trim()) {
          // sendMessage({ text: values.prompt.trim() });
          form.reset();
        }
      })}
    >
      <Box
        className={cx(classes.root, className)}
        mod={{ variant }}
        style={{
          '--input-radius':
            props.radius === undefined ? undefined : getRadius(props.radius),
        }}
        {...props}
      >
        <FocusTrap active={!disabled}>
          <Textarea
            placeholder="Введите сообщение"
            radius={props.radius}
            rows={5}
            size="md"
            variant={variant}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            className={cx(classes.textArea, textAreaProps?.className)}
            key={form.key('prompt')}
            {...form.getInputProps('prompt')}
            {...textAreaProps}
          />
        </FocusTrap>

        <Group p={14}>
          <ActionIcon variant="light" type="submit" size="lg" ml="auto">
            <IconArrowBigUp strokeWidth={1.2} />
          </ActionIcon>
        </Group>
      </Box>
    </form>
  );
};
