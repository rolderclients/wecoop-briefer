import { nanoid } from 'nanoid';
import { Chat, useChat, useEditor } from '@/components';

export const BriefChat = ({ height }: { height: string }) => {
	const { messages, sendMessage, setMessages, model, prompt } = useChat();
	const { editor, editedByUser, setEditedByUser } = useEditor();

	return (
		<Chat.Root h={height}>
			<Chat.Conversation />
			<Chat.Input
				onSubmit={(message) => {
					if (message && 'text' in message) {
						const text = (message.text as string).trim();
						if (text) {
							if (editedByUser) {
								setMessages([
									{
										id: nanoid(),
										role: 'system',
										parts: [
											{
												type: 'text',
												text: `Документ был изменен пользователем:
\`\`\`html
${editor?.getHTML()}
\`\`\`
											`,
											},
										],
									},
									...messages,
								]);

								setEditedByUser(false);
							}

							sendMessage({ text, model, prompt });
						}
					}
				}}
			/>
		</Chat.Root>
	);
};
