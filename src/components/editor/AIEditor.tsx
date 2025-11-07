import { useChat } from '../chat';
import { Editor, type EditorProps } from '.';

export const AIEditor = ({ content, editable, ...props }: EditorProps) => {
	const { document, chatStatus, setDocumentEditedByUser } = useChat();

	return (
		<Editor
			{...props}
			content={document || content}
			editable={editable || chatStatus !== 'ready'}
			onChange={() => setDocumentEditedByUser(true)}
		/>
	);
};
