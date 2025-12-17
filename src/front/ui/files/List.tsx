import { Group, Stack, type StackProps, Text } from '@mantine/core';
import { IconPointFilled, IconTrash } from '@tabler/icons-react';
import numbro from 'numbro';
import { getSignedFileUrlFn } from '@/back';
import type { File as FyleType } from '@/types';
import { HoverActionIcon, HoverPaper, usePaperHover } from '~/ui';
import { File } from './File';
import { useFiles } from './Provider';

export const List = (props: StackProps) => {
	const { files } = useFiles();

	return files.length > 0 ? (
		<Stack {...props}>
			{files.map((file) => (
				<FilePaper key={`${file.s3Key}-${file.originalName}`} file={file} />
			))}
		</Stack>
	) : null;
};

const FilePaper = ({ file }: { file: FyleType }) => {
	const { isPending, deleteFiles } = useFiles();
	const { paperHovered, paperRef } = usePaperHover();

	return (
		<HoverPaper
			ref={paperRef}
			withBorder
			p="sm"
			radius="md"
			onClick={async () => {
				const url = await getSignedFileUrlFn({ data: { s3Key: file.s3Key } });
				window.open(url, '_blank');
			}}
		>
			<Group align="center" pos="relative">
				<File file={file} />

				<Group gap={8} wrap="nowrap" align="center" w="calc(100% - 60px)">
					<Text inline truncate>
						{file.originalName}
					</Text>
					<IconPointFilled size={12} />
					<Text inline c="dimmed" style={{ whiteSpace: 'nowrap' }}>
						{numbro(file.size).format({
							output: 'byte',
							base: 'binary',
							mantissa: 1,
							spaceSeparated: true,
						})}
					</Text>
				</Group>

				<HoverActionIcon
					hovered={paperHovered}
					disabled={isPending}
					pos="absolute"
					right={0}
					color="red"
					onClick={(e) => {
						e.stopPropagation();
						deleteFiles([file]);
					}}
				>
					<IconTrash size={20} />
				</HoverActionIcon>
			</Group>
		</HoverPaper>
	);
};
