import { RichTextEditor } from '@mantine/tiptap';
import { ScrollArea } from '~/ui';

export const Content = ({ height }: { height: string }) => {
	return (
		<ScrollArea h={height} autoScroll radius="md">
			<RichTextEditor.Content />
			<ScrollArea.ScrollButton />
		</ScrollArea>
	);
};
