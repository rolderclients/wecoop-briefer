import { Box, Checkbox, Grid, Text } from '@mantine/core';
import { IconEdit } from '@tabler/icons-react';
import type { Service } from '@/types';
import { HoverActionIcon, HoverPaper, usePaperHover } from '~/ui';
import { useServices } from '../Provider';

export const ServicesList = ({ services }: { services: Service[] }) =>
	services.map((service) => (
		<ServicePaper key={service.id} service={service}></ServicePaper>
	));

const ServicePaper = ({ service }: { service: Service }) => {
	const { paperHovered, paperRef } = usePaperHover();
	const {
		selectedIds,
		setSelectedIds,
		isArchived,
		openEdit,
		setSelectedService,
	} = useServices();

	return (
		<HoverPaper ref={paperRef} radius="md" withBorder>
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
						<HoverActionIcon
							aria-label="Изменить"
							hovered={paperHovered}
							onClick={() => {
								setSelectedService(service);
								openEdit();
							}}
							mt={4}
						>
							<IconEdit size={20} />
						</HoverActionIcon>
					)}
				</Grid.Col>
			</Grid>
		</HoverPaper>
	);
};
