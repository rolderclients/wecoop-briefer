import { useEffect } from 'react';
import { Editor, useChat, useEditor } from '@/components';

export const BriefEditor = ({ saving }: { saving?: boolean }) => {
	const { editor, setEditedByUser } = useEditor();
	const { document } = useChat();

	useEffect(() => {
		if (document) {
			editor?.commands.setContent(document);
			setEditedByUser(false);
		}
	}, [editor?.commands.setContent, setEditedByUser, document]);

	return (
		<Editor>
			<Editor.Toolbar saving={saving} />
			<Editor.Content height="calc(100vh - 161px)" />
		</Editor>
	);
};
