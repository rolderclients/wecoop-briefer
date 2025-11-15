import {
	useDebouncedCallback,
	useMergedRef,
	useResizeObserver,
} from '@mantine/hooks';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { ScrollAreaState, ScrollPosition } from './types';

interface UseScrollAreaOptions {
	autoScroll?: boolean;
	scrollToBottomOnInit?: boolean;
	animated?: boolean;
	nearThreshold?: number;
}

export const useScrollAreaState = (
	options: UseScrollAreaOptions = {},
): ScrollAreaState => {
	const {
		autoScroll = false,
		scrollToBottomOnInit = false,
		animated = true,
		nearThreshold = 32,
	} = options;

	const scrollAreaRef = useRef<HTMLDivElement | null>(null);
	const isUserInteractingRef = useRef(false);
	const userInteractionTimeoutRef = useRef<NodeJS.Timeout | undefined>(
		undefined,
	);
	const isInitializedRef = useRef(false);

	// Единый ResizeObserver для отслеживания изменений размера контента
	const [contentResizeRef, contentRect] = useResizeObserver();

	const [scrollPosition, setScrollPosition] = useState<ScrollPosition>({
		scrollTop: 0,
		clientHeight: 0,
		scrollHeight: 0,
	});

	// Вычисляемые состояния позиции
	const isAtTop = scrollPosition.scrollTop === 0;
	const isAtBottom =
		scrollPosition.scrollTop + scrollPosition.clientHeight >=
		scrollPosition.scrollHeight;
	const isNearTop = scrollPosition.scrollTop <= nearThreshold;
	const isNearBottom =
		scrollPosition.scrollTop + scrollPosition.clientHeight >=
		scrollPosition.scrollHeight - nearThreshold;
	const isAboveCenter =
		scrollPosition.scrollTop <
		(scrollPosition.scrollHeight - scrollPosition.clientHeight) / 2;
	const hasScrollableContent =
		scrollPosition.scrollHeight > scrollPosition.clientHeight;

	// Используем useDebouncedCallback для оптимизации производительности
	const debouncedUpdatePosition = useDebouncedCallback(
		(element: HTMLElement) => {
			const newPosition: ScrollPosition = {
				scrollTop: element.scrollTop,
				clientHeight: element.clientHeight,
				scrollHeight: element.scrollHeight,
			};

			setScrollPosition(newPosition);
		},
		{ delay: 16 }, // 60fps
	);

	// Методы управления прокруткой
	const scrollToTop = useCallback(
		(isAnimated?: boolean) => {
			const element = scrollAreaRef.current;
			if (!element) return;

			const shouldAnimate = isAnimated ?? animated;

			if (shouldAnimate) {
				element.scrollTo({ top: 0, behavior: 'smooth' });
			} else {
				element.scrollTop = 0;
			}
		},
		[animated],
	);

	const scrollToBottom = useCallback(
		(isAnimated?: boolean) => {
			const element = scrollAreaRef.current;
			if (!element) return;

			const shouldAnimate = isAnimated ?? animated;

			if (shouldAnimate) {
				element.scrollTo({ top: element.scrollHeight, behavior: 'smooth' });
			} else {
				element.scrollTop = element.scrollHeight;
			}

			// Запоминаем scrollHeight до скролла
			const scrollHeightBefore = element.scrollHeight;

			// Проверка результата и повтор если нужно
			setTimeout(() => {
				const scrollHeightAfter = element.scrollHeight;
				const diff =
					element.scrollHeight - (element.scrollTop + element.clientHeight);

				if (diff > 1 && scrollHeightAfter !== scrollHeightBefore) {
					// ScrollHeight изменился после скролла - повторяем
					element.scrollTop = element.scrollHeight;
				}
			}, 50);
		},
		[animated],
	);

	// Универсальная функция автоскролла
	const performAutoScroll = useCallback(() => {
		if (!autoScroll || isUserInteractingRef.current || !scrollAreaRef.current) {
			return;
		}

		// Для автоскролла используем isAtBottom (точная позиция)
		if (isAtBottom) {
			scrollToBottom(false);
		}
	}, [autoScroll, isAtBottom, scrollToBottom]);

	// Детекция пользовательского взаимодействия
	const handleUserInteraction = useCallback(() => {
		isUserInteractingRef.current = true;

		if (userInteractionTimeoutRef.current) {
			clearTimeout(userInteractionTimeoutRef.current);
		}

		userInteractionTimeoutRef.current = setTimeout(() => {
			isUserInteractingRef.current = false;
		}, 150);
	}, []);

	// Обработчик скролла
	const handleScroll = useCallback(
		(event: Event) => {
			const element = event.target as HTMLElement;
			debouncedUpdatePosition(element);
		},
		[debouncedUpdatePosition],
	);

	// Прокрутка к концу при инициализации
	useEffect(() => {
		if (!scrollToBottomOnInit || isInitializedRef.current) {
			return;
		}

		if (hasScrollableContent) {
			scrollToBottom(animated);
			isInitializedRef.current = true;
		}
	}, [scrollToBottomOnInit, hasScrollableContent, scrollToBottom, animated]);

	// Единый эффект для автоскролла при изменении контента
	useEffect(() => {
		const element = scrollAreaRef.current;

		if (!element || contentRect.height === 0) {
			return;
		}

		// Обновляем позицию
		debouncedUpdatePosition(element);

		// Автоскролл с небольшой задержкой
		const timeoutId = setTimeout(performAutoScroll, 10);

		return () => clearTimeout(timeoutId);
	}, [contentRect.height, debouncedUpdatePosition, performAutoScroll]);

	// Установка обработчиков событий
	useEffect(() => {
		const element = scrollAreaRef.current;
		if (!element) return;

		const events = ['wheel', 'touchstart', 'touchmove', 'mousedown'] as const;

		element.addEventListener('scroll', handleScroll);
		events.forEach((event) => {
			element.addEventListener(event, handleUserInteraction);
		});

		// Инициализация позиции
		debouncedUpdatePosition(element);

		return () => {
			element.removeEventListener('scroll', handleScroll);
			events.forEach((event) => {
				element.removeEventListener(event, handleUserInteraction);
			});

			if (userInteractionTimeoutRef.current) {
				clearTimeout(userInteractionTimeoutRef.current);
			}
		};
	}, [handleScroll, handleUserInteraction, debouncedUpdatePosition]);

	// Единый ref
	const callbackRef = useMergedRef(scrollAreaRef);

	return {
		isAtTop,
		isNearTop,
		isAtBottom,
		isNearBottom,
		isAboveCenter,
		hasScrollableContent,
		scrollToTop,
		scrollToBottom,
		viewportRef: scrollAreaRef,
		_callbackRef: callbackRef,
		_contentResizeRef: contentResizeRef as unknown as (
			node: HTMLDivElement | null,
		) => void,
	};
};
