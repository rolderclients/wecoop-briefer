import { getTaskListExtension, Link } from '@mantine/tiptap';
import Highlight from '@tiptap/extension-highlight';
import Placeholder from '@tiptap/extension-placeholder';
import { TableKit } from '@tiptap/extension-table';
import TaskItem from '@tiptap/extension-task-item';
import TipTapTaskList from '@tiptap/extension-task-list';
import TextAlign from '@tiptap/extension-text-align';
import type { Editor } from '@tiptap/react';
import { useEditor as useTipTapEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { createContext, useContext, useState } from 'react';
import type { EditorProps } from '.';

interface EditorContext {
	editor: Editor | null;
	disabledToolbar: boolean;
	setDisabledToolbar: (value: boolean) => void;
	editedByUser: boolean;
	setEditedByUser: (value: boolean) => void;
}

const EditorContext = createContext<EditorContext | null>(null);

export const Provider = ({
	children,
	initialContent,
	initialDisabledToolbar,
	onChange,
}: EditorProps) => {
	const [editedByUser, setEditedByUser] = useState(true);

	const editor = useTipTapEditor({
		shouldRerenderOnTransaction: false,
		immediatelyRender: false,
		extensions: [
			StarterKit.configure({ link: false }),
			Placeholder.configure({ placeholder: 'This is placeholder' }),
			Link,
			Highlight,
			TextAlign.configure({ types: ['heading', 'paragraph'] }),
			getTaskListExtension(TipTapTaskList),
			TaskItem.configure({ nested: true }),
			TableKit,
		],
		content: initialContent,
		onUpdate: ({ editor }) => {
			onChange?.(editor.getHTML());
		},
		onFocus: () => {
			setEditedByUser(true);
		},
	});

	const [disabledToolbar, setDisabledToolbar] = useState(
		!!initialDisabledToolbar,
	);

	const value: EditorContext = {
		editor,
		disabledToolbar,
		setDisabledToolbar,
		editedByUser,
		setEditedByUser,
	};

	return (
		<EditorContext.Provider value={value}>{children}</EditorContext.Provider>
	);
};

export const useEditor = () => {
	const context = useContext(EditorContext);
	if (!context) {
		throw new Error('useEditor must be used within EditorProvider');
	}

	return context;
};
