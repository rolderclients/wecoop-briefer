import type { MantineStyleProps } from '@mantine/core';
import type { RefCallback, RefObject } from 'react';
import { createContext, type ReactNode, useContext } from 'react';
import {
	type Animation,
	type ScrollTo,
	useScrollArea as useScrollAreaHook,
} from './useScrollArea';

interface ScrollAreaContext {
	height?: MantineStyleProps['h'];
	scrollRef: RefObject<HTMLElement | null> & RefCallback<HTMLElement>;
	contentRef: RefObject<HTMLElement | null> & RefCallback<HTMLElement>;
	scrollToBottom: ScrollTo;
	scrollToTop: ScrollTo;
	hasScrollableContent: boolean;
	isNearBottom: boolean;
	isAtBottom: boolean;
	isNearTop: boolean;
	isAboveCenter: boolean;
	escapedFromLock: boolean;
}

const ScrollAreaContext = createContext<ScrollAreaContext | null>(null);

export const ScrollAreaProvider = ({
	children,
	height,
	autoScrollOnInitialRender = false,
	autoScroll = false,
	scrollAnimation = 'smooth',
}: {
	children: ReactNode;
	height?: MantineStyleProps['h'];
	autoScrollOnInitialRender?: boolean;
	autoScroll?: boolean;
	scrollAnimation?: Animation;
}) => {
	const {
		scrollRef,
		contentRef,
		isNearBottom,
		isAtBottom,
		isNearTop,
		isAboveCenter,
		escapedFromLock,
		hasScrollableContent,
		scrollToBottom,
		scrollToTop,
	} = useScrollAreaHook({
		autoScrollOnInitialRender,
		autoScroll,
	});

	const value = {
		height,
		scrollRef,
		contentRef,
		scrollToBottom: (options = {}) =>
			scrollToBottom({ animation: scrollAnimation, ...options }),
		scrollToTop: (options = {}) =>
			scrollToTop({ animation: scrollAnimation, ...options }),
		hasScrollableContent,
		isNearBottom,
		isAtBottom,
		isNearTop,
		isAboveCenter,
		escapedFromLock,
	};

	return (
		<ScrollAreaContext.Provider value={value}>
			{children}
		</ScrollAreaContext.Provider>
	);
};

export const useScrollAreaContext = () => {
	const context = useContext(ScrollAreaContext);
	if (!context) {
		throw new Error('useScrollArea must be used within ScrollAreaProvider');
	}
	return context;
};
