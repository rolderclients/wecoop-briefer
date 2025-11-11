import { getTaskListExtension, Link, RichTextEditor } from '@mantine/tiptap';
import Highlight from '@tiptap/extension-highlight';
import { TableKit } from '@tiptap/extension-table';
import TaskItem from '@tiptap/extension-task-item';
import TipTapTaskList from '@tiptap/extension-task-list';
import TextAlign from '@tiptap/extension-text-align';
import { type Editor, useEditor as useTipTapEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { createContext, type ReactNode, useContext, useState } from 'react';
import { parsePart } from '@/lib';
import type { AgentUIMessage } from '@/routes/api/chat';

interface EditorContext {
	editor: Editor | null;
	content: string;
	setContent: (content: string) => void;
	// setDocumentFromMessages: (messages: AgentUIMessage[]) => void;
	editedByUser: boolean;
	setEditedByUser: (value: boolean) => void;
	editable?: boolean;
	setEditable: (value: boolean) => void;
	saving: boolean;
	setSaving: (value: boolean) => void;
	setOnChangeHandler: (handler: (content: string) => void) => void;
}

const EditorContext = createContext<EditorContext | null>(null);

export const EditorProvider = ({
	children,
	initialContent,
	initialEditable,
}: {
	children: ReactNode;
	initialContent: string;
	initialEditable?: boolean;
}) => {
	const [content, setContent] = useState(initialContent);
	const [editable, setEditable] = useState(initialEditable);
	const [saving, setSaving] = useState(false);
	const [editedByUser, setEditedByUser] = useState(true);

	const editor = useTipTapEditor({
		shouldRerenderOnTransaction: false,
		immediatelyRender: false,
		extensions: [
			StarterKit.configure({ link: false }),
			Link,
			Highlight,
			TextAlign.configure({ types: ['heading', 'paragraph'] }),
			getTaskListExtension(TipTapTaskList),
			TaskItem.configure({ nested: true }),
			TableKit,
		],
		content,
		onUpdate: ({ editor }) => {
			const content = editor.getHTML();
			setContent(content);
			onChangeHandler?.(content);
		},
		editable: !!editable,
		// onFocus,
	});

	const value: EditorContext = {
		editor,
		content,
		setContent,
		editable,
		setEditable: (editable) => {
			setEditable(editable);
			editor?.setEditable(editable);
		},
		saving,
		setSaving,
		onChange: onChangeHandler,
		setOnChangeHandler: (onChange?: (content: string) => void) => {
			setOnChangeHandler(onChange);
		},
		// setDocument,
		// setDocumentFromMessages: (messages: AgentUIMessage[]) => {
		// 	const lastMessage = messages[messages.length - 1];
		// 	const textParts = lastMessage?.parts?.filter((i) => i.type === 'text');
		// 	const lastPart = textParts?.[textParts.length - 1] || { text: '' };
		// 	parsePart(lastPart).then((i) => {
		// 		if (i.document) {
		// 			console.log('Document parsed:', i.document);
		// 			setDocument(i.document);
		// 			setEditedByUser(false);
		// 		}
		// 	});
		// },
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
