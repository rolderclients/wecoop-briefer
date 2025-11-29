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
import { createContext, useContext, useEffect, useState } from 'react';
import type { EditorProps } from './types';

interface EditorContext {
	editor: Editor | null;
	editable?: boolean;
	setEditable: (value: boolean) => void;
	disabledToolbar: boolean;
	setDisabledToolbar: (value: boolean) => void;
	focused: boolean;
	setFocused: (value: boolean) => void;
	editedByUser: boolean;
	setEditedByUser: (value: boolean) => void;
}

const EditorContext = createContext<EditorContext | null>(null);

export const Provider = ({
	children,
	initialContent,
	initialEditable = true,
	initialDisabledToolbar,
	onChange,
}: EditorProps) => {
	const editor = useTipTapEditor({
		shouldRerenderOnTransaction: false,
		immediatelyRender: false,
		extensions: [
			StarterKit.configure({ link: false }),
			Placeholder.configure({ placeholder: 'Документ пуст' }),
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
		editable: initialEditable,
	});

	const [editable, setEditable] = useState(initialEditable);
	const [disabledToolbar, setDisabledToolbar] = useState(
		!!initialDisabledToolbar,
	);

	const [editedByUser, setEditedByUser] = useState(true);
	const [focused, setFocused] = useState(false);

	useEffect(() => {
		editor?.on('focus', () => setFocused(true));
		editor?.on('blur', () => setFocused(false));
		editor?.on('update', ({ transaction }) => {
			if (transaction.docChanged && focused) setEditedByUser(true);
			if (transaction.docChanged && !focused) setEditedByUser(false);
		});
	}, [editor, focused]);

	const value: EditorContext = {
		editor,
		editable,
		setEditable,
		disabledToolbar,
		setDisabledToolbar,
		editedByUser,
		setEditedByUser,
		focused,
		setFocused,
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
