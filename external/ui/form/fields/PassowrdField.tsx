import { PasswordInput, type PasswordInputProps } from '@mantine/core';
import { useFieldContext } from '../context';

export const PassowrdField = (props: PasswordInputProps) => {
	const field = useFieldContext<string>();

	return (
		<PasswordInput
			size="lg"
			label="Пароль"
			placeholder="Введите пароль"
			name={field.name}
			value={field.state.value}
			onChange={(e) => field.handleChange(e.target.value)}
			onBlur={field.handleBlur}
			error={field.state.meta.errors.map((error) => error.message).join(', ')}
			{...props}
		/>
	);
};
