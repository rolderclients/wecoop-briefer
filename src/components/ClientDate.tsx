import { Text, type TextProps } from '@mantine/core';
import { ClientOnly } from '@tanstack/react-router';
import type * as React from 'react';

interface ClientDateProps extends Omit<TextProps, 'children'> {
	date: string | Date;
	locale?: string;
	options?: Intl.DateTimeFormatOptions;
	fallback?: React.ReactNode;
}

export const ClientDate: React.FC<ClientDateProps> = ({
	date,
	locale = 'ru-RU',
	options = {
		hour: 'numeric',
		minute: 'numeric',
	},
	fallback = '—',
	...textProps
}) => {
	return (
		<ClientOnly fallback={fallback}>
			<Text {...textProps}>
				{new Date(date).toLocaleDateString(locale, options)}
			</Text>
		</ClientOnly>
	);
};
