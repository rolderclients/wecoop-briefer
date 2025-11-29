import { ActionIcon, TextInput, type TextInputProps } from '@mantine/core';
import { IconRefresh } from '@tabler/icons-react';
//@ts-expect-error
import generatePassword from 'omgopass';
import { useFieldContext } from '../context';

export const TextPassowrdField = (props: TextInputProps) => {
	const field = useFieldContext<string>();

	return (
		<TextInput
			label="Пароль"
			placeholder="Введите пароль"
			rightSection={
				<ActionIcon
					variant="light"
					onClick={() =>
						field.setValue(
							generatePassword({
								minSyllableLength: 2,
								maxSyllableLength: 2,
							}),
						)
					}
				>
					<IconRefresh size={16} />
				</ActionIcon>
			}
			name={field.name}
			value={field.state.value}
			onChange={(e) => field.handleChange(e.target.value)}
			onBlur={field.handleBlur}
			error={field.state.meta.errors.map((error) => error.message).join(', ')}
			{...props}
		/>
	);
};
