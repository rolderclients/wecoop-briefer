import { Center, Loader } from '@mantine/core';
import { getTaskListExtension, Link, RichTextEditor } from '@mantine/tiptap';
import { IconCheck } from '@tabler/icons-react';
import Highlight from '@tiptap/extension-highlight';
import { TableKit } from '@tiptap/extension-table';
import TaskItem from '@tiptap/extension-task-item';
import TipTapTaskList from '@tiptap/extension-task-list';
import TextAlign from '@tiptap/extension-text-align';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useEffect } from 'react';
import { ScrollArea } from '../kit';
import classes from './editor.module.css';

export { AIEditor } from './AIEditor';

export interface EditorProps {
	content?: string;
	onChange?: (value: string) => void;
	saving?: boolean;
	editable?: boolean;
	height?: string;
}

export const Editor = ({
	content,
	onChange,
	saving,
	editable,
	height,
}: EditorProps) => {
	const editor = useEditor({
		shouldRerenderOnTransaction: false,
		immediatelyRender: false,
		extensions: [
			StarterKit.configure({ link: false }),
			Link,
			Highlight,
			TextAlign.configure({ types: ['heading', 'paragraph'] }),
			getTaskListExtension(TipTapTaskList),
			TaskItem.configure({
				nested: true,
				HTMLAttributes: {
					class: 'test-item',
				},
			}),
			TableKit,
		],
		content: content,
		onUpdate: ({ editor }) => onChange?.(editor.getHTML()),
		editable: !!editable,
	});

	useEffect(() => {
		editor?.commands.setContent(content || '');
	}, [content, editor]);

	return editor ? (
		<RichTextEditor editor={editor} className={classes.editor}>
			{editable && (
				<RichTextEditor.Toolbar sticky>
					<RichTextEditor.ControlsGroup>
						<RichTextEditor.Bold />
						<RichTextEditor.Italic />
						<RichTextEditor.Underline />
						<RichTextEditor.Strikethrough />
						<RichTextEditor.ClearFormatting />
						<RichTextEditor.Highlight />
						<RichTextEditor.Code />
					</RichTextEditor.ControlsGroup>

					<RichTextEditor.ControlsGroup>
						<RichTextEditor.H1 />
						<RichTextEditor.H2 />
						<RichTextEditor.H3 />
						<RichTextEditor.H4 />
					</RichTextEditor.ControlsGroup>

					<RichTextEditor.ControlsGroup>
						<RichTextEditor.Blockquote />
						<RichTextEditor.Hr />
						<RichTextEditor.BulletList />
						<RichTextEditor.OrderedList />
					</RichTextEditor.ControlsGroup>

					<RichTextEditor.ControlsGroup>
						<RichTextEditor.TaskList />
						<RichTextEditor.TaskListLift />
						<RichTextEditor.TaskListSink />
					</RichTextEditor.ControlsGroup>

					<RichTextEditor.ControlsGroup>
						<RichTextEditor.Link />
						<RichTextEditor.Unlink />
					</RichTextEditor.ControlsGroup>

					<RichTextEditor.ControlsGroup>
						<RichTextEditor.AlignLeft />
						<RichTextEditor.AlignCenter />
						<RichTextEditor.AlignJustify />
						<RichTextEditor.AlignRight />
					</RichTextEditor.ControlsGroup>

					<RichTextEditor.ControlsGroup>
						<RichTextEditor.Undo />
						<RichTextEditor.Redo />
					</RichTextEditor.ControlsGroup>

					<RichTextEditor.Control ml="auto" style={{ cursor: 'default' }}>
						{saving ? (
							<Loader size={14} />
						) : (
							<IconCheck stroke={1.5} size={16} />
						)}
					</RichTextEditor.Control>
				</RichTextEditor.Toolbar>
			)}

			<ScrollArea height={height} autoScroll={true}>
				<ScrollArea.Content>
					<RichTextEditor.Content />
				</ScrollArea.Content>

				<ScrollArea.ScrollButton />
			</ScrollArea>
		</RichTextEditor>
	) : (
		<Center mt="xl">
			<Loader size="lg" />
		</Center>
	);
};
