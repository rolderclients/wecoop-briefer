import { Editor, useEditor } from '@/components';

export const BriefChat = ({ saving }: { saving?: boolean }) => {
	// const { disabledToolbar, setDisabledToolbar } = useEditor();

	return (
		<Editor>
			<Editor.Toolbar saving={saving} />
			<Editor.Content height="calc(100vh - 161px)" />
		</Editor>
	);
};
