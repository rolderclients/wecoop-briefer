import type {
	MantineRadius,
	ScrollAreaProps as MantineScrollAreaProps,
} from '@mantine/core';
import type { ReactNode } from 'react';

export interface ScrollAreaProps
	extends Omit<MantineScrollAreaProps, 'children'> {
	/** Включение автоскролла при добавлении контента (по умолчанию false) */
	autoScroll?: boolean;
	/** Прокрутить к концу при инициализации компонента (по умолчанию false) */
	scrollToBottomOnInit?: boolean;
	/** Анимированная прокрутка (по умолчанию true) */
	animated?: boolean;
	/** Отступ для near-зон в пикселях (по умолчанию 100) */
	nearThreshold?: number;
	/** Радиус для viewport и scrollbar на тот случай, когда они "торчат" углами*/
	radius?: MantineRadius;
	/** Дочерние элементы - автоматически оборачиваются в ScrollArea.Content */
	children: ReactNode;
}

export interface ScrollAreaHook {
	/** Точно в начале (scrollTop === 0) */
	isAtTop: boolean;
	/** В пределах nearThreshold от начала */
	isNearTop: boolean;
	/** Точно в конце (scrollTop + clientHeight >= scrollHeight) */
	isAtBottom: boolean;
	/** В пределах nearThreshold от конца */
	isNearBottom: boolean;
	/** Выше центральной точки области прокрутки */
	isAboveCenter: boolean;
	/** Есть контент требующий прокрутки */
	hasScrollableContent: boolean;

	/** Прокрутить к началу области */
	scrollToTop: (animated?: boolean) => void;
	/** Прокрутить к концу области */
	scrollToBottom: (animated?: boolean) => void;

	/** React ref на viewport элемент для прямого доступа к DOM */
	viewportRef: React.RefObject<HTMLDivElement | null>;
}

export interface ScrollAreaState extends ScrollAreaHook {
	/** Внутренний callback ref для подключения к Mantine ScrollArea */
	_callbackRef: (node: HTMLDivElement | null) => void;
	/** Внутренний ref для наблюдения за изменениями контента */
	_contentResizeRef: (node: HTMLDivElement | null) => void;
}

export interface ScrollAreaContextValue extends ScrollAreaState {
	/** Радиус для viewport и scrollbar на тот случай, когда они "торчат" углами*/
	radius?: MantineRadius;
	/** Пропсы Mantine ScrollArea, переданные в корневой компонент */
	mantineProps: Omit<MantineScrollAreaProps, 'children'>;
}

export interface ScrollButtonProps {
	/** CSS классы для стилизации кнопки */
	className?: string;
	/** Иконка для прокрутки вверх (по умолчанию IconChevronUp) */
	upIcon?: ReactNode;
	/** Иконка для прокрутки вниз (по умолчанию IconChevronDown) */
	downIcon?: ReactNode;
}

/** Внутренний тип для отслеживания позиции скролла */
export interface ScrollPosition {
	/** Текущая позиция скролла сверху */
	scrollTop: number;
	/** Высота видимой области */
	clientHeight: number;
	/** Общая высота прокручиваемого контента */
	scrollHeight: number;
}
