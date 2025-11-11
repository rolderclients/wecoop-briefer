import { Center, Loader } from '@mantine/core';
import { RichTextEditor } from '@mantine/tiptap';
import classes from './editor.module.css';
import { useEditor } from './Provider';

export const Root = ({ children }: { children: React.ReactNode }) => {
	const { editor } = useEditor();

	return editor ? (
		<RichTextEditor editor={editor} className={classes.editor}>
			{children}
		</RichTextEditor>
	) : (
		<Center mt="xl">
			<Loader size="lg" />
		</Center>
	);
};
