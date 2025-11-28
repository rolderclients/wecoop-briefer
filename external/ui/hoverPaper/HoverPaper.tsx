import { type ElementProps, Paper, type PaperProps } from '@mantine/core';
import { useHover } from '@mantine/hooks';
import clsx from 'clsx';
import { forwardRef } from 'react';
import classes from './styles.module.css';

interface Props extends PaperProps, ElementProps<'div', keyof PaperProps> {
	disabled?: boolean;
}

export const HoverPaper = forwardRef<HTMLDivElement, Props>(
	({ className, disabled, ...props }: Props, ref) => (
		<Paper
			ref={ref}
			className={clsx(classes.root, className)}
			mod={{ disabled }}
			{...props}
		/>
	),
);

export const usePaperHover = () => {
	const { hovered: paperHovered, ref: paperRef } = useHover();
	return { paperHovered, paperRef };
};
