import { ScrollAreaProvider } from './context';
import { ScrollAreaButton } from './ScrollAreaButton';
import { ScrollAreaContent } from './ScrollAreaContent';
import type { ScrollAreaContextValue, ScrollAreaProps } from './types';
import { useScrollAreaState } from './useScrollArea';

const ScrollAreaRoot = ({
	children,
	autoScroll = false,
	scrollToBottomOnInit = false,
	animated = true,
	nearThreshold = 100,
	radius,
	...mantineProps
}: ScrollAreaProps) => {
	const scrollAreaValue = useScrollAreaState({
		autoScroll,
		scrollToBottomOnInit,
		animated,
		nearThreshold,
	});

	// Создаем контекст с mantineProps
	const contextValue: ScrollAreaContextValue = {
		...scrollAreaValue,
		radius,
		mantineProps,
	};

	return (
		<ScrollAreaProvider value={contextValue}>
			<ScrollAreaContent>{children}</ScrollAreaContent>
		</ScrollAreaProvider>
	);
};

ScrollAreaRoot.displayName = 'ScrollArea';

/**
 * ScrollArea Component - Расширенная область прокрутки с автоскроллом
 *
 * @example
 * // Базовое использование
 * <ScrollArea h={300}>
 *   <div>Контент для прокрутки</div>
 * </ScrollArea>
 *
 * @example
 * // С автоскроллом и кнопкой
 * <ScrollArea autoScroll scrollToBottomOnInit h={400}>
 *   <div>Чат сообщения...</div>
 *   <ScrollArea.ScrollButton className="absolute bottom-4 right-4" />
 * </ScrollArea>
 *
 * @example
 * // С кастомными настройками
 * <ScrollArea
 *   autoScroll={true}
 *   animated={true}
 *   nearThreshold={50}
 *   h={300}
 *   scrollbarSize={6}
 *   type="hover"
 * >
 *   {messages.map(msg => <div key={msg.id}>{msg.text}</div>)}
 *   <ScrollArea.ScrollButton
 *     className="absolute bottom-4 right-4"
 *     upIcon={<CustomUpIcon />}
 *     downIcon={<CustomDownIcon />}
 *   />
 * </ScrollArea>
 *
 * @example
 * // Использование хука для доступа к viewport
 * function CustomControl() {
 *   const { isAtBottom, scrollToBottom, viewportRef } = useScrollArea();
 *
 *   const scrollToElement = () => {
 *     const target = viewportRef.current?.querySelector('[data-target]');
 *     target?.scrollIntoView();
 *   };
 *
 *   return (
 *     <button onClick={scrollToBottom} disabled={isAtBottom}>
 *       Прокрутить вниз
 *     </button>
 *   );
 * }
 */
export const ScrollArea = Object.assign(ScrollAreaRoot, {
	ScrollButton: ScrollAreaButton,
	Provider: ScrollAreaProvider,
});
