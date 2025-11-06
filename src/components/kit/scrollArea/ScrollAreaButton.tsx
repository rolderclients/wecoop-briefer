import { ActionIcon } from '@mantine/core';
import { IconChevronDown, IconChevronUp } from '@tabler/icons-react';
import { useScrollArea } from './context';
import type { ScrollButtonProps } from './types';

export const ScrollAreaButton = ({
	className,
	upIcon,
	downIcon,
}: ScrollButtonProps) => {
	const { hasScrollableContent, isAboveCenter, scrollToTop, scrollToBottom } =
		useScrollArea();

	// Не показываем кнопку, если нет прокручиваемого контента
	if (!hasScrollableContent) {
		return null;
	}

	const isScrollingDown = isAboveCenter;
	const icon = isScrollingDown
		? (downIcon ?? <IconChevronDown size={16} />)
		: (upIcon ?? <IconChevronUp size={16} />);

	const handleClick = () => {
		if (isScrollingDown) {
			scrollToBottom();
		} else {
			scrollToTop();
		}
	};

	return (
		<ActionIcon
			pos="absolute"
			bottom={16}
			right={16}
			variant="light"
			onClick={handleClick}
			className={className}
			aria-label={isScrollingDown ? 'Scroll to bottom' : 'Scroll to top'}
		>
			{icon}
		</ActionIcon>
	);
};

ScrollAreaButton.displayName = 'ScrollArea.ScrollButton';
