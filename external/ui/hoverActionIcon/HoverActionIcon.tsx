import {
	ActionIcon,
	type ActionIconProps,
	type ElementProps,
} from '@mantine/core';
import clsx from 'clsx';
import classes from './styles.module.css';

interface Props
	extends ActionIconProps,
		ElementProps<'button', keyof ActionIconProps> {
	hovered?: boolean;
}

export const HoverActionIcon = ({ className, hovered, ...props }: Props) => (
	<ActionIcon
		className={clsx(classes.root, className)}
		mod={{ hovered }}
		{...props}
	/>
);
