import { ActionIcon, type ActionIconProps } from '@mantine/core';
import { IconArrowBigUp, IconX } from '@tabler/icons-react';
import type { ChatStatus } from 'ai';

export type PromptInputSubmitProps = ActionIconProps & {
	status?: ChatStatus;
};

export const PromptInputSubmit = ({
	className,
	variant = 'light',
	size = 'lg',
	status,
	children,
	...props
}: PromptInputSubmitProps) => {
	let Icon = <IconArrowBigUp strokeWidth={1.5} />;

	if (status === 'error') {
		Icon = <IconX strokeWidth={1.5} />;
	}

	return (
		<ActionIcon
			aria-label="Submit"
			className={className}
			size={size}
			type="submit"
			variant={variant}
			color={status === 'error' ? 'red' : undefined}
			loading={status === 'submitted'}
			{...props}
		>
			{children ?? Icon}
		</ActionIcon>
	);
};
