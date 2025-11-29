import { Button, type ButtonProps } from '@mantine/core';
import { IconDeviceFloppy } from '@tabler/icons-react';
import { useFormContext } from '../context';

export const SubmitButton = (
	props: ButtonProps & { label?: string; onClick?: () => void },
) => {
	const form = useFormContext();
	return (
		<form.Subscribe selector={(state) => state.isSubmitting}>
			{(isSubmitting) => (
				<Button
					type="submit"
					size="xs"
					leftSection={<IconDeviceFloppy size={20} />}
					loading={isSubmitting}
					{...props}
				>
					{props.label || 'Сохранить'}
				</Button>
			)}
		</form.Subscribe>
	);
};
