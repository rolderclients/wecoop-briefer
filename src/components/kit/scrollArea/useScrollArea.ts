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
		nearThreshold = 100,
	} = options;

	const scrollAreaRef = useRef<HTMLDivElement | null>(null);
	const isUserInteractingRef = useRef(false);
	const userInteractionTimeoutRef = useRef<NodeJS.Timeout | undefined>(
		undefined,
	);
	const isInitializedRef = useRef(false);

	// Используем useResizeObserver для отслеживания изменений размера
	const [resizeRef, rect] = useResizeObserver();
	// ResizeObserver для контента - отслеживает изменения высоты содержимого
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

	// Обработчик скролла
	const handleScroll = useCallback(
		(event: Event) => {
			const element = event.target as HTMLElement;
			debouncedUpdatePosition(element);
		},
		[debouncedUpdatePosition],
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
			if (!element) {
				console.log('scrollToBottom: element is null');
				return;
			}

			const shouldAnimate = isAnimated ?? animated;

			if (shouldAnimate) {
				element.scrollTo({ top: element.scrollHeight, behavior: 'smooth' });
			} else {
				element.scrollTop = element.scrollHeight;
			}
		},
		[animated],
	);

	// Детекция пользовательского взаимодействия
	const handleUserInteraction = useCallback(() => {
		isUserInteractingRef.current = true;

		// Сброс флага через таймаут
		if (userInteractionTimeoutRef.current) {
			clearTimeout(userInteractionTimeoutRef.current);
		}

		userInteractionTimeoutRef.current = setTimeout(() => {
			isUserInteractingRef.current = false;
		}, 150);
	}, []);

	// Автоскролл перенесен в MutationObserver

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

	// Обновление позиции при изменении размеров + автоскролл
	useEffect(() => {
		if (scrollAreaRef.current && (rect.width > 0 || rect.height > 0)) {
			// Автоскролл при изменении размеров (добавлении контента)
			if (autoScroll && !isUserInteractingRef.current && isNearBottom) {
				scrollToBottom(false);
			}

			debouncedUpdatePosition(scrollAreaRef.current);
		}
	}, [
		rect.width,
		rect.height,
		debouncedUpdatePosition,
		autoScroll,
		isNearBottom,
		scrollToBottom,
	]);

	// Установка обработчиков событий
	useEffect(() => {
		const element = scrollAreaRef.current;
		if (!element) return;

		// Обработчики скролла и пользовательского взаимодействия
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

	// Автоскролл при изменении размера контента (использует contentResizeObserver)
	useEffect(() => {
		// Пропускаем первый вызов (инициализация)
		if (contentRect.width === 0 && contentRect.height === 0) {
			return;
		}

		// Автоскролл при увеличении высоты контента
		if (autoScroll && !isUserInteractingRef.current && isNearBottom) {
			scrollToBottom(false);
		}
	}, [
		contentRect.height,
		contentRect.width,
		autoScroll,
		isNearBottom,
		scrollToBottom,
	]);

	// Объединяем рефы для правильной работы с useMergedRef
	const callbackRef = useMergedRef(scrollAreaRef, resizeRef);

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
