import { getRadius, ScrollArea as MantineScrollArea } from '@mantine/core';
import { forwardRef, useContext } from 'react';
import { ScrollAreaContext } from './context';
import classes from './scrollArea.module.css';
import type { ScrollAreaContentProps } from './types';

export const ScrollAreaContent = forwardRef<
	HTMLDivElement,
	ScrollAreaContentProps
>(({ children }, ref) => {
	// Получаем полное состояние из контекста (включая внутренние детали)
	const fullContext = useContext(ScrollAreaContext);
	if (!fullContext) {
		throw new Error('ScrollAreaContent must be used within ScrollArea');
	}

	const { _callbackRef, mantineProps, radius, _contentResizeRef } = fullContext;

	return (
		<MantineScrollArea
			h="100%"
			className={classes.scrollArea}
			style={{ '--radius': radius ? getRadius(radius) : undefined }}
			{...mantineProps}
			viewportRef={_callbackRef}
			ref={ref}
		>
			<div ref={_contentResizeRef}>{children}</div>
		</MantineScrollArea>
	);
});

ScrollAreaContent.displayName = 'ScrollArea.Content';
