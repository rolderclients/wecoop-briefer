import {
	ActionIcon,
	Box,
	Checkbox,
	Grid,
	Paper,
	Space,
	Stack,
	Switch,
	Text,
	Tooltip,
} from '@mantine/core';
import {
	hasLength,
	isEmail,
	isNotEmpty,
	matchesField,
	type UseFormReturnType,
	useForm,
} from '@mantine/form';
import { useDisclosure, useHover } from '@mantine/hooks';
import { IconEdit } from '@tabler/icons-react';
import { useState } from 'react';
import type { FormUser, User } from '@/api';
import { useAuth } from '@/app';
import classes from '@/lib/styles.module.css';
import { Edit } from './Edit';
import { useUsers } from './Provider';

export const UsersList = () => {
	const { users } = useUsers();

	const form = useForm({
		mode: 'uncontrolled',
		initialValues: {
			id: '',
			name: '',
			email: '',
			password: '',
			confirmPassword: '',
		},
		validate: {
			id: isNotEmpty(),
			name: isNotEmpty(),
			email: isEmail('Неверный формат email'),
			password: hasLength(
				{ min: 6 },
				'Пароль должен содержать не менее 6 символов',
			),
			confirmPassword: matchesField('password', 'Пароли не совпадают'),
		},
	});

	const [opened, { open, close }] = useDisclosure(false);

	return (
		<Stack mt="sm">
			<Grid px="md" c="dimmed">
				<Grid.Col span="content">
					<Space w={20} />
				</Grid.Col>
				<Grid.Col span="auto">ФИО</Grid.Col>
				<Grid.Col span="auto">Почта</Grid.Col>
				<Grid.Col span="auto">Пароль</Grid.Col>
				<Grid.Col span="content">Блокировка</Grid.Col>
				<Grid.Col span="content">
					<Space w={28} />
				</Grid.Col>
			</Grid>

			{users.map((user) => (
				<UserPaper
					key={user.id}
					user={user}
					form={form}
					open={open}
				></UserPaper>
			))}

			<Edit form={form} opened={opened} close={close} />
		</Stack>
	);
};

const UserPaper = ({
	user,
	form,
	open,
}: {
	user: User;
	form: UseFormReturnType<FormUser>;
	open: () => void;
}) => {
	const { hovered, ref } = useHover();
	const { selectedIds, setSelectedIds, archived, updateUser } = useUsers();
	const { session } = useAuth();

	const handleEditClick = () => {
		const values = {
			id: user.id,
			name: user.name,
			email: user.email,
			password: user.notSecure,
			confirmPassword: user.notSecure,
		};
		form.setInitialValues(values);
		form.reset();
		open();
	};

	const [blocked, setBlocked] = useState(user.blocked);

	return (
		<Paper ref={ref} radius="md" withBorder>
			<Grid px="md" py="xs" align="center">
				<Grid.Col span="content">
					<Tooltip
						label="Не возможно архивировать собственную учетную запись"
						multiline
						w={210}
						disabled={session?.user?.id !== user.id}
					>
						<Checkbox
							checked={selectedIds.includes(user.id)}
							disabled={session?.user?.id === user.id}
							onChange={(e) => {
								setSelectedIds(
									e.currentTarget.checked
										? [...selectedIds, user.id]
										: selectedIds.filter((id) => id !== user.id),
								);
							}}
						/>
					</Tooltip>
				</Grid.Col>
				<Grid.Col span="auto">
					<Text inline>{user.name}</Text>
				</Grid.Col>
				<Grid.Col span="auto">
					<Text inline>{user.email}</Text>
				</Grid.Col>

				<Grid.Col span="auto">
					<Text inline>{user.notSecure}</Text>
				</Grid.Col>

				<Grid.Col span="content">
					<Box w={88} onClick={(e) => e.stopPropagation()}>
						<Tooltip
							label="Не возможно блокировать собственную учетную запись"
							multiline
							w={210}
							refProp="rootRef"
							disabled={session?.user?.id !== user.id}
						>
							<Switch
								color="red"
								checked={blocked}
								disabled={archived || session?.user?.id === user.id}
								onChange={(event) => {
									setBlocked(event.currentTarget.checked);
									updateUser({
										id: user.id,
										blocked: event.currentTarget.checked,
									});
								}}
							/>
						</Tooltip>
					</Box>
				</Grid.Col>

				<Grid.Col span="content">
					{archived ? (
						<Box w={28} h={35} />
					) : (
						<ActionIcon
							aria-label="Изменить"
							className={classes.editActionIcon}
							mod={{ hovered }}
							onClick={handleEditClick}
							mt={4}
						>
							<IconEdit size={20} />
						</ActionIcon>
					)}
				</Grid.Col>
			</Grid>
		</Paper>
	);
};
