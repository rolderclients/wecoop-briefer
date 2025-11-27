import { useEffect } from 'react';
import { Editor, useChat, useEditor } from '@/components';
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

	const document = useDocument(messages);

	useEffect(() => {
		if (document) editor?.commands.setContent(document);
	}, [editor, document]);

	useEffect(() => {
		editor?.setEditable(chatStatus === 'ready');
	}, [editor, chatStatus]);

	return (
		<Editor.Root>
			<Editor.Toolbar saving={saving} />
			<Editor.Content height={height} />
		</Editor.Root>
	);
};
