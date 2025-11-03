import {
  Box,
  type BoxProps,
  getRadius,
  type InputVariant,
  type MantineRadius,
  type MantineSize,
} from '@mantine/core';
import { isNotEmpty, useForm } from '@mantine/form';
import cx from 'clsx';
import { Input } from './Input';
import { PromptInputProvider } from './Provider';
import classes from './promptInput.module.css';
import { SendButton } from './SendButton';
import { Toolbar } from './Toolbar';

export { usePromptInput } from './Provider';

interface PromptInputProps extends BoxProps {
  children?: React.ReactNode;
  disabled?: boolean;
  variant?: InputVariant;
  size?: MantineSize;
  radius?: MantineRadius;
  onSubmit?: (values: { prompt: string }) => void;
  initialValues?: { prompt: string };
}

const Root = ({
  className,
  disabled,
  variant = 'default',
  size,
  radius,
  onSubmit,
  initialValues = { prompt: '' },
  ...props
}: PromptInputProps) => {
  const form = useForm<{ prompt: string }>({
    mode: 'uncontrolled',
    initialValues,
    validate: {
      prompt: isNotEmpty(),
    },
  });

  return (
    <PromptInputProvider
      form={form}
      variant={variant}
      size={size}
      radius={radius}
    >
      <form
        onSubmit={
          onSubmit &&
          form.onSubmit((v) => {
            onSubmit(v);
            form.reset();
          })
        }
      >
        <Box
          className={cx(classes.root, className)}
          mod={{ variant }}
          style={{
            borderRadius: radius === undefined ? undefined : getRadius(radius),
          }}
          {...props}
        />
      </form>
    </PromptInputProvider>
  );
};

export const PromptInput = Object.assign(Root, {
  Input,
  Provider: PromptInputProvider,
  Toolbar,
  SendButton,
});
