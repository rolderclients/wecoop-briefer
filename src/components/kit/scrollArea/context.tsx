import { createContext, useContext } from 'react';
import type { ScrollAreaContextValue, ScrollAreaHook } from './types';

/** Внутренний контекст для передачи состояния ScrollArea */
export const ScrollAreaContext = createContext<ScrollAreaContextValue | null>(
	null,
);

export const ScrollAreaProvider = ScrollAreaContext.Provider;

/**
 * Хук для доступа к состоянию и методам ScrollArea
 *
 * @returns Объект с индикаторами позиции, методами управления и ref на viewport
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { isAtBottom, scrollToTop, viewportRef } = useScrollArea();
 *
 *   const scrollToElement = () => {
 *     const target = viewportRef.current?.querySelector('[data-target]');
 *     target?.scrollIntoView();
 *   };
 *
 *   return (
 *     <button onClick={scrollToTop} disabled={isAtTop}>
 *       В начало
 *     </button>
 *   );
 * }
 * ```
 */
export const useScrollArea = (): ScrollAreaHook => {
	const context = useContext(ScrollAreaContext);
	if (!context) {
		throw new Error('useScrollArea must be used within ScrollArea');
	}

	// Возвращаем только публичный API, скрывая внутренние детали
	const { _callbackRef, mantineProps: _, ...publicAPI } = context;
	return publicAPI;
};
