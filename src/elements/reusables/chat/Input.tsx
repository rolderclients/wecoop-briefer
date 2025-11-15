import {
	PromptInput,
	PromptInputBody,
	PromptInputFooter,
	type PromptInputProps,
	PromptInputTextarea,
} from '@/components/ai-elements/prompt-input';
import { PromptInputSubmit } from '@/elements/ai-elements';
import { cn } from '@/lib';
import { useChat } from './Provider';

export const Input = ({
	className,
	onSubmit,
	...props
}: Omit<PromptInputProps, 'onSubmit'> & {
	onSubmit?: PromptInputProps['onSubmit'];
}) => {
	const { sendMessage, chatStatus, model, prompt } = useChat();

	return (
		<PromptInput
			onSubmit={(message, event) => {
				if (onSubmit) {
					onSubmit(message, event);
					return;
				}

				if (message && 'text' in message) {
					const text = message.text as string;
					if (text.trim()) sendMessage({ text: text.trim(), model, prompt });
				}
			}}
			className={cn('relative *:ring-0!', className)}
			{...props}
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
	);
};
