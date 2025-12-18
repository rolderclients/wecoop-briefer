import { Text, Tooltip } from '@mantine/core';
import {
	PromptInput,
	PromptInputBody,
	PromptInputFooter,
	type PromptInputProps,
	PromptInputTextarea,
} from '@/components/ai-elements/prompt-input';
import { cn } from '@/lib/utils';
import { PromptInputSubmit } from '../vercel-ai-elements';
import { useChat } from './Provider';

export const Input = ({
	className,
	onSubmit,
	...props
}: Omit<PromptInputProps, 'onSubmit'> & {
	onSubmit?: PromptInputProps['onSubmit'];
}) => {
	const { sendMessage, chatStatus, disabled, model } = useChat();

	return (
		<Tooltip
			label="Услуга этого брифа не имеет активного промта"
			disabled={!disabled}
		>
			<PromptInput
				onSubmit={(message, event) => {
					if (onSubmit) {
						onSubmit(message, event);
						return;
					}

					if (message && 'text' in message) {
						const text = message.text as string;
						if (text.trim()) sendMessage(text.trim());
					}
				}}
				className={cn('relative *:ring-0!', className)}
				{...props}
			>
				<PromptInputBody>
					<PromptInputTextarea
						disabled={chatStatus !== 'ready' || disabled}
						placeholder="Напишите сообщение"
						className="min-h-[85px] max-h-[85px]"
					/>
				</PromptInputBody>

				<PromptInputFooter className="pt-0 items-center">
					<Text size="sm" c={model ? undefined : 'red'}>
						{model?.title || 'Модель ИИ не выбрана'}
					</Text>
					<PromptInputSubmit
						className="ml-auto"
						disabled={chatStatus !== 'ready' || disabled}
						status={chatStatus}
					/>
				</PromptInputFooter>
			</PromptInput>
		</Tooltip>
	);
};
