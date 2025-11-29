import { RichTextEditor } from '@mantine/tiptap';
import { useEditor } from './Provider';
import classes from './styles.module.css';

export const Root = ({ children }: { children: React.ReactNode }) => {
	const { editor } = useEditor();

	return (
		<RichTextEditor editor={editor} className={classes.editor}>
			{children}
		</RichTextEditor>
	);
};
