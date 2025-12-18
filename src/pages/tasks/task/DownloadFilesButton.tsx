import { Button } from '@mantine/core';
import { IconDownload } from '@tabler/icons-react';
import { useState } from 'react';
import { useFiles } from '@/front';

export const DownloadFilesButton = () => {
	const [downloading, setDownloading] = useState<boolean>(false);

	const { downloadAllFiles } = useFiles();

	return (
		<Button
			loading={downloading}
			// disabled={!filesRef.current?.files?.length}
			component="div"
			size="xs"
			color="green"
			variant="light"
			leftSection={<IconDownload size={16} />}
			onClick={async () => {
				setDownloading(true);
				await downloadAllFiles();
				setDownloading(false);
			}}
		>
			Скачать файлы
		</Button>
	);
};
