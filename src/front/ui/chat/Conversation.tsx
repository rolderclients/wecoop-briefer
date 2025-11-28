import { Paper, type PaperProps } from '@mantine/core';
import {
	Conversation as ConversationComponent,
	ConversationContent,
	ConversationEmptyState,
} from '@/components/ai-elements/conversation';
import { ScrollArea } from '~/ui';
import { ChatMessage } from './Message';
import { useChat } from './Provider';

export const Conversation = (props: PaperProps) => {
	const { messages, hasMessages } = useChat();

	return (
		<Paper h="calc(100% - 149px)" withBorder radius="md" {...props}>
			<ScrollArea autoScroll scrollToBottomOnInit>
				<ConversationComponent>
					<ConversationContent className="gap-4">
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
	);
};
