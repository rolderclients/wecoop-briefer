import { Button, type ButtonProps } from '@mantine/core';
import { useFormContext } from '../context';

export const SubscribeButton = (
	props: ButtonProps & { label: string; onClick?: () => void },
) => {
	const form = useFormContext();
	return (
		<form.Subscribe selector={(state) => state.isSubmitting}>
			{(isSubmitting) => (
				<Button type="button" disabled={isSubmitting} {...props}>
					{props.label}
				</Button>
			)}
		</form.Subscribe>
	);
};
