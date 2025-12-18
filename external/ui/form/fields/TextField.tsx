import { TextInput, type TextInputProps } from '@mantine/core';
import { useFieldContext } from '../context';

export const TextField = (props: TextInputProps) => {
	const field = useFieldContext<string>();

	return (
		<TextInput
			name={field.name}
			value={field.state.value}
			onChange={(e) => field.handleChange(e.target.value)}
			onBlur={field.handleBlur}
			error={field.state.meta.errors.map((error) => error.message).join(', ')}
			{...props}
		/>
	);
};
