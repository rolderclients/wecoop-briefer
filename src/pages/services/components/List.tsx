import { ActionIcon, Box, Checkbox, Grid, Paper, Text } from '@mantine/core';
import { useHover } from '@mantine/hooks';
import { IconEdit } from '@tabler/icons-react';
import type { Service } from '@/app';
import classes from '@/app/styles.module.css';
import { useServices } from '../Provider';

export const ServicesList = ({ services }: { services: Service[] }) =>
	services.map((service) => (
		<ServicePaper key={service.id} service={service}></ServicePaper>
	));

const ServicePaper = ({ service }: { service: Service }) => {
	const { hovered, ref } = useHover();
	const {
		selectedIds,
		setSelectedIds,
		isArchived,
		openEdit,
		setSelectedService,
	} = useServices();

	return (
		<Paper ref={ref} radius="md" withBorder>
			<Grid px="md" py="xs" align="center">
				<Grid.Col span="content">
					<Checkbox
						checked={selectedIds.includes(service.id)}
						onChange={(e) => {
							setSelectedIds(
								e.currentTarget.checked
									? [...selectedIds, service.id]
									: selectedIds.filter((id) => id !== service.id),
							);
						}}
					/>
				</Grid.Col>
				<Grid.Col span="auto">
					<Text inline>{service.title}</Text>
				</Grid.Col>

				<Grid.Col span="content">
					{isArchived ? (
						<Box h={35} />
					) : (
						<ActionIcon
							aria-label="Изменить"
							className={classes.hoverActionIcon}
							mod={{ hovered }}
							onClick={() => {
								setSelectedService(service);
								openEdit();
							}}
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
