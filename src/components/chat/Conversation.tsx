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
import type { ModelName } from '@/lib';
import { ScrollArea } from '../kit';
import { ChatMessage } from './Message';
import { useChat } from './Provider';

export const ChatConversation = ({
	model,
	prompt,
	...props
}: StackProps & { model: ModelName; prompt?: string }) => {
	const { messages, hasMessages, sendMessage, chatStatus } = useChat();

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
					if (values.text?.trim())
						sendMessage({ text: values.text.trim(), model, prompt });
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
						disabled={chatStatus !== 'ready'}
						status={chatStatus}
					/>
				</PromptInputFooter>
			</PromptInput>
		</Stack>
	);
};
