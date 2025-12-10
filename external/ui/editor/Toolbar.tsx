import { Loader } from '@mantine/core';
import { RichTextEditor } from '@mantine/tiptap';
import { IconCheck } from '@tabler/icons-react';
import type { ReactNode } from 'react';
import { useEditor } from './Provider';

export const Toolbar = ({
	saving,
	children,
}: {
	saving?: boolean;
	children?: ReactNode;
}) => {
	const { editor, disabledToolbar } = useEditor();

	return !disabledToolbar ? (
		<RichTextEditor.Toolbar sticky>
			<RichTextEditor.ControlsGroup>
				<RichTextEditor.Bold disabled={!editor?.isEditable} />
				<RichTextEditor.Italic disabled={!editor?.isEditable} />
				<RichTextEditor.Underline disabled={!editor?.isEditable} />
				<RichTextEditor.Strikethrough disabled={!editor?.isEditable} />
				<RichTextEditor.ClearFormatting disabled={!editor?.isEditable} />
				<RichTextEditor.Highlight disabled={!editor?.isEditable} />
				<RichTextEditor.Code disabled={!editor?.isEditable} />
			</RichTextEditor.ControlsGroup>

			<RichTextEditor.ControlsGroup>
				<RichTextEditor.H1 disabled={!editor?.isEditable} />
				<RichTextEditor.H2 disabled={!editor?.isEditable} />
				<RichTextEditor.H3 disabled={!editor?.isEditable} />
				<RichTextEditor.H4 disabled={!editor?.isEditable} />
			</RichTextEditor.ControlsGroup>

			<RichTextEditor.ControlsGroup>
				<RichTextEditor.Blockquote disabled={!editor?.isEditable} />
				<RichTextEditor.Hr disabled={!editor?.isEditable} />
				<RichTextEditor.BulletList disabled={!editor?.isEditable} />
				<RichTextEditor.OrderedList disabled={!editor?.isEditable} />
			</RichTextEditor.ControlsGroup>

			<RichTextEditor.ControlsGroup>
				<RichTextEditor.TaskList disabled={!editor?.isEditable} />
				<RichTextEditor.TaskListLift disabled={!editor?.isEditable} />
				<RichTextEditor.TaskListSink disabled={!editor?.isEditable} />
			</RichTextEditor.ControlsGroup>

			<RichTextEditor.ControlsGroup>
				<RichTextEditor.Link disabled={!editor?.isEditable} />
				<RichTextEditor.Unlink disabled={!editor?.isEditable} />
			</RichTextEditor.ControlsGroup>

			<RichTextEditor.ControlsGroup>
				<RichTextEditor.AlignLeft disabled={!editor?.isEditable} />
				<RichTextEditor.AlignCenter disabled={!editor?.isEditable} />
				<RichTextEditor.AlignJustify disabled={!editor?.isEditable} />
				<RichTextEditor.AlignRight disabled={!editor?.isEditable} />
			</RichTextEditor.ControlsGroup>

			<RichTextEditor.ControlsGroup>
				<RichTextEditor.Undo disabled={!editor?.isEditable} />
				<RichTextEditor.Redo disabled={!editor?.isEditable} />
			</RichTextEditor.ControlsGroup>

			<RichTextEditor.ControlsGroup ml="auto">
				{children}

				<RichTextEditor.Control ml="10px" style={{ cursor: 'default' }}>
					{saving ? <Loader size={14} /> : <IconCheck stroke={1.5} size={16} />}
				</RichTextEditor.Control>
			</RichTextEditor.ControlsGroup>
		</RichTextEditor.Toolbar>
	) : null;
};
