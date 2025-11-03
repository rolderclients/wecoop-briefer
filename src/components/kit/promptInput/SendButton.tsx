import { ActionIcon, type ActionIconProps } from '@mantine/core';
import { IconArrowBigUp } from '@tabler/icons-react';
import { usePromptInput } from './Provider';

export const SendButton = (props: ActionIconProps) => {
  const { disabled } = usePromptInput();

  return (
    <ActionIcon
      variant="light"
      type="submit"
      size="lg"
      ml="auto"
      disabled={disabled}
      {...props}
    >
      <IconArrowBigUp strokeWidth={1.2} />
    </ActionIcon>
  );
};
