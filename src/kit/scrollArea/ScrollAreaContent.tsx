import { Box, getRadius, ScrollArea as MantineScrollArea } from '@mantine/core';
import { useContext } from 'react';
import { ScrollAreaContext } from './context';
import classes from './styles.module.css';

export const ScrollAreaContent = ({
	children,
}: {
	children: React.ReactNode;
}) => {
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
		>
			<Box h="100%" ref={_contentResizeRef}>
				{children}
			</Box>
		</MantineScrollArea>
	);
};

ScrollAreaContent.displayName = 'ScrollArea.Content';
