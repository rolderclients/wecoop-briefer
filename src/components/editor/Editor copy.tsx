import { Center, Loader } from '@mantine/core';
import { RichTextEditor } from '@mantine/tiptap';
import { IconCheck } from '@tabler/icons-react';
import { useEffect } from 'react';
import { ScrollArea } from '../kit';
import classes from './editor.module.css';
import { useEditor } from './Provider';

export interface EditorProps {
	// content?: string;
	// onChange?: (value: string) => void;
	// onFocus?: () => void;
	// saving?: boolean;
	// editable?: boolean;
	height?: string;
	disabledToolbar?: boolean;
}

export const Editor = ({
	// content,
	// saving,
	height,
	disabledToolbar,
}: EditorProps) => {
	const { editor, editable, saving } = useEditor();

	// useEffect(() => {
	// 	editor?.commands.setContent(content || '');
	// }, [content, editor]);

	return editor ? (
		<RichTextEditor editor={editor} className={classes.editor}>
			{!disabledToolbar && (
				<RichTextEditor.Toolbar sticky>
					<RichTextEditor.ControlsGroup>
						<RichTextEditor.Bold disabled={!editable} />
						<RichTextEditor.Italic disabled={!editable} />
						<RichTextEditor.Underline disabled={!editable} />
						<RichTextEditor.Strikethrough disabled={!editable} />
						<RichTextEditor.ClearFormatting disabled={!editable} />
						<RichTextEditor.Highlight disabled={!editable} />
						<RichTextEditor.Code disabled={!editable} />
					</RichTextEditor.ControlsGroup>

					<RichTextEditor.ControlsGroup>
						<RichTextEditor.H1 disabled={!editable} />
						<RichTextEditor.H2 disabled={!editable} />
						<RichTextEditor.H3 disabled={!editable} />
						<RichTextEditor.H4 disabled={!editable} />
					</RichTextEditor.ControlsGroup>

					<RichTextEditor.ControlsGroup>
						<RichTextEditor.Blockquote disabled={!editable} />
						<RichTextEditor.Hr disabled={!editable} />
						<RichTextEditor.BulletList disabled={!editable} />
						<RichTextEditor.OrderedList disabled={!editable} />
					</RichTextEditor.ControlsGroup>

					<RichTextEditor.ControlsGroup>
						<RichTextEditor.TaskList disabled={!editable} />
						<RichTextEditor.TaskListLift disabled={!editable} />
						<RichTextEditor.TaskListSink disabled={!editable} />
					</RichTextEditor.ControlsGroup>

					<RichTextEditor.ControlsGroup>
						<RichTextEditor.Link disabled={!editable} />
						<RichTextEditor.Unlink disabled={!editable} />
					</RichTextEditor.ControlsGroup>

					<RichTextEditor.ControlsGroup>
						<RichTextEditor.AlignLeft disabled={!editable} />
						<RichTextEditor.AlignCenter disabled={!editable} />
						<RichTextEditor.AlignJustify disabled={!editable} />
						<RichTextEditor.AlignRight disabled={!editable} />
					</RichTextEditor.ControlsGroup>

					<RichTextEditor.ControlsGroup>
						<RichTextEditor.Undo disabled={!editable} />
						<RichTextEditor.Redo disabled={!editable} />
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

			<ScrollArea h={height} autoScroll radius="md">
				<RichTextEditor.Content />
				<ScrollArea.ScrollButton />
			</ScrollArea>
		</RichTextEditor>
	) : (
		<Center mt="xl">
			<Loader size="lg" />
		</Center>
	);
};
