import { Paper, Stack, type StackProps } from '@mantine/core';
import {
	Conversation as ConversationComponent,
	ConversationContent,
	ConversationEmptyState,
	PromptInput,
	PromptInputBody,
	PromptInputFooter,
	PromptInputSubmit,
	PromptInputTextarea,
} from '@/components/ai-elements';
import { ScrollArea } from '../kit';
import { ChatMessage } from './Message';
import { useChat } from './Provider';

export const ChatConversation = (props: StackProps) => {
	const { messages, hasMessages, sendMessage, status } = useChat();

	return (
		<Stack {...props}>
			<Paper h="calc(100% - 149px)" withBorder radius="md">
				<ScrollArea autoScroll scrollToBottomOnInit>
					<ConversationComponent>
						<ConversationContent>
							{hasMessages ? (
								messages.map((message) => (
									<ChatMessage key={message.id} message={message} />
								))
							) : (
								<ConversationEmptyState
									title="Нет сообщений"
									description="Начните общение, чтобы увидеть сообщения здесь"
								/>
							)}
						</ConversationContent>
					</ConversationComponent>

					<ScrollArea.ScrollButton />
				</ScrollArea>
			</Paper>

			<PromptInput
				onSubmit={(values) => {
					if (values.text?.trim()) sendMessage({ text: values.text.trim() });
				}}
				className="relative"
			>
				<PromptInputBody>
					<PromptInputTextarea
						placeholder="Напишите сообщение"
						className="min-h-[85px] max-h-[85px]"
					/>
				</PromptInputBody>
				<PromptInputFooter className="pt-0">
					<PromptInputSubmit
						className="ml-auto"
						disabled={status !== 'ready'}
						status={status}
					/>
				</PromptInputFooter>
			</PromptInput>
		</Stack>
	);
};
