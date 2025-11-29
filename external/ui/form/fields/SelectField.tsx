import { Select, type SelectProps } from '@mantine/core';
import { useFieldContext } from '../context';

export const SelectField = (props: SelectProps) => {
	const field = useFieldContext<string | null>();

	return (
		<Select
			name={field.name}
			value={field.state.value}
			onChange={field.handleChange}
			onBlur={field.handleBlur}
			error={field.state.meta.errors.map((error) => error.message).join(', ')}
			{...props}
		/>
	);
};
