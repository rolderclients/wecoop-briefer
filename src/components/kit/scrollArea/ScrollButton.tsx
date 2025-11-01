import { ActionIcon, type ActionIconProps } from '@mantine/core';
import { IconArrowDown, IconArrowUp } from '@tabler/icons-react';
import type { RefCallback, RefObject } from 'react';

export interface ScrollButtonProps extends ActionIconProps {
  scrollRef?: RefObject<HTMLElement | null> & RefCallback<HTMLElement>;
  at?: 'top' | 'bottom';
}

export const ScrollButton = ({
  scrollRef,
  at,
  ...props
}: ScrollButtonProps) => {
  const scrollToBottom = () =>
    scrollRef?.current?.scrollTo({
      top: scrollRef?.current?.scrollHeight,
      behavior: 'smooth',
    });

  const scrollToTop = () =>
    scrollRef?.current?.scrollTo({ top: 0, behavior: 'smooth' });

  return at ? (
    <ActionIcon
      pos="absolute"
      bottom={16}
      right={16}
      variant="light"
      onClick={at === 'top' ? scrollToBottom : scrollToTop}
      {...props}
    >
      {at === 'top' ? (
        <IconArrowDown strokeWidth={1.5} />
      ) : (
        <IconArrowUp strokeWidth={1.5} />
      )}
    </ActionIcon>
  ) : null;
};
