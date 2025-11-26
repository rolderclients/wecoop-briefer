import {
	ActionIcon,
	Box,
	Grid,
	Group,
	Paper,
	Space,
	Stack,
	Switch,
	Text,
	Tooltip,
} from '@mantine/core';
import { useHover } from '@mantine/hooks';
import { IconEdit, IconKey, IconTrash } from '@tabler/icons-react';
import { useState } from 'react';
import { type User, useAuth } from '@/app';
import classes from '@/app/styles.module.css';
import { useUsers } from '../provider';

const roles = {
	admin: 'Администратор',
	manager: 'Менеджер',
};

export const UsersList = () => {
	const { users } = useUsers();

	return (
		<Stack mt="sm">
			<Grid px="md" c="dimmed">
				<Grid.Col span="auto">ФИО</Grid.Col>
				<Grid.Col span="auto">Почта</Grid.Col>
				<Grid.Col span="auto">Логин</Grid.Col>
				<Grid.Col span="auto">Роль</Grid.Col>
				<Grid.Col span="content">Блокировка</Grid.Col>
				<Grid.Col span="content">
					<Space w={104} />
				</Grid.Col>
			</Grid>

			{users
				.filter((user) => user.username !== 'root')
				.map((user) => (
					<UserPaper key={user.id} user={user}></UserPaper>
				))}
		</Stack>
	);
};

const UserPaper = ({ user }: { user: User }) => {
	const { hovered, ref } = useHover();
	const {
		setSelectedUser,
		openEdit,
		openEditCredentials,
		openDelete,
		updateBlockMutation,
	} = useUsers();
	const { user: authUser } = useAuth();

	const [blocked, setBlocked] = useState(Boolean(user.banned));

	return (
		<Paper ref={ref} radius="md" withBorder>
			<Grid px="md" py="xs" align="center">
				<Grid.Col span="auto">
					<Text inline>{user.name}</Text>
				</Grid.Col>
				<Grid.Col span="auto">
					<Text inline>{user.email}</Text>
				</Grid.Col>
				<Grid.Col span="auto">
					<Text inline>{user.username}</Text>
				</Grid.Col>
				<Grid.Col span="auto">
					<Text inline>{roles[user.role]}</Text>
				</Grid.Col>

				<Grid.Col span="content">
					<Box w={88} onClick={(e) => e.stopPropagation()}>
						<Tooltip
							label="Не возможно блокировать собственную учетную запись"
							multiline
							w={210}
							refProp="rootRef"
							disabled={authUser?.id !== user.id}
						>
							<Switch
								color="red"
								checked={blocked}
								disabled={authUser?.id === user.id}
								onChange={(event) => {
									setBlocked(event.currentTarget.checked);
									updateBlockMutation.mutate({
										id: user.id,
										block: event.currentTarget.checked,
									});
								}}
							/>
						</Tooltip>
					</Box>
				</Grid.Col>

				<Grid.Col span="content">
					<Group gap="xs">
						<Tooltip
							label="Не возможно удалить собственную учетную запись"
							multiline
							w={210}
							disabled={authUser?.id !== user.id}
						>
							<ActionIcon
								aria-label="Удалить"
								color="red"
								className={classes.hoverActionIcon}
								mod={{ hovered }}
								onClick={() => {
									setSelectedUser(user.id);
									openDelete();
								}}
								disabled={authUser?.id === user.id}
								mt={4}
							>
								<IconTrash size={20} />
							</ActionIcon>
						</Tooltip>

						<ActionIcon
							aria-label="Изменить данные доступа"
							className={classes.hoverActionIcon}
							mod={{ hovered }}
							onClick={() => {
								setSelectedUser(user.id);
								openEditCredentials();
							}}
							mt={4}
							color="yellow"
						>
							<IconKey size={20} />
						</ActionIcon>

						<ActionIcon
							aria-label="Изменить"
							className={classes.hoverActionIcon}
							mod={{ hovered }}
							onClick={() => {
								setSelectedUser(user.id);
								openEdit();
							}}
							mt={4}
						>
							<IconEdit size={20} />
						</ActionIcon>
					</Group>
				</Grid.Col>
			</Grid>
		</Paper>
	);
};
