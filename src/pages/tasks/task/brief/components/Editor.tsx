import { Loader, Tooltip } from '@mantine/core';
import { RichTextEditor } from '@mantine/tiptap';
import { IconFileTypePdf } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { downloadPDF, useChat } from '@/front';
import { Editor, useEditor } from '~/ui';
import { useDocument } from './useDocument';

export const BriefEditor = ({
	height = '100%',
	saving,
}: {
	height?: string;
	saving?: boolean;
}) => {
	const { editor } = useEditor();
	const { messages, chatStatus } = useChat();

	const [downloading, setDownloading] = useState<boolean>(false);

	const document = useDocument(messages);

	useEffect(() => {
		if (document) editor?.commands.setContent(document);
	}, [editor, document]);

	useEffect(() => {
		editor?.setEditable(chatStatus === 'ready');
	}, [editor, chatStatus]);

	return (
		<Editor.Root>
			<Editor.Toolbar saving={saving}>
				<RichTextEditor.Control
					onClick={async () => {
						setDownloading(true);
						await downloadPDF(editor?.getHTML() || '', 'brief.pdf');
						setDownloading(false);
					}}
				>
					<Tooltip
						label="Скачать PDF"
						color="dark"
						position="bottom"
						offset={10}
						openDelay={100}
						closeDelay={200}
					>
						{downloading ? (
							<Loader size={14} />
						) : (
							<IconFileTypePdf stroke={1.5} size={16} color="green" />
						)}
					</Tooltip>
				</RichTextEditor.Control>
			</Editor.Toolbar>
			<Editor.Content height={height} />
		</Editor.Root>
	);
};
