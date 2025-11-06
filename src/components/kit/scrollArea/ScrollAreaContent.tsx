import { ScrollArea as MantineScrollArea } from '@mantine/core';
import { forwardRef, useContext } from 'react';
import { ScrollAreaContext } from './context';
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

	const { _callbackRef, mantineProps } = fullContext;

	return (
		<MantineScrollArea {...mantineProps} viewportRef={_callbackRef} ref={ref}>
			{children}
		</MantineScrollArea>
	);
});

ScrollAreaContent.displayName = 'ScrollArea.Content';
