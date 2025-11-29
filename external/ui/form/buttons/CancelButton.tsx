import { Button, type ButtonProps } from '@mantine/core';
import { IconCancel } from '@tabler/icons-react';
import { useFormContext } from '../context';

export const CancelButton = (
	props: ButtonProps & { label?: string; onClick?: () => void },
) => {
	const form = useFormContext();
	return (
		<form.Subscribe selector={(state) => state.isSubmitting}>
			{(isSubmitting) => (
				<Button
					type="reset"
					size="xs"
					variant="light"
					leftSection={<IconCancel size={16} />}
					disabled={isSubmitting}
					{...props}
				>
					{props.label || 'Отмена'}
				</Button>
			)}
		</form.Subscribe>
	);
};
