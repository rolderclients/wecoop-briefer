import { useDocument } from '@/lib';
import { useChat } from '../chat';
import { Editor, type EditorProps } from '.';

export const AIEditor = ({ content, editable, ...props }: EditorProps) => {
	const { messages, status } = useChat();

	const lastMessage = messages[messages.length - 1];
	const textParts = lastMessage?.parts?.filter((i) => i.type === 'text');
	const lastPart = textParts?.[textParts.length - 1];

	const document = useDocument(lastPart || { text: '' });

	return (
		<Editor
			{...props}
			content={document || content}
			editable={editable || status !== 'ready'}
		/>
	);
};
