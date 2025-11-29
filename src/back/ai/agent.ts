import { Output, ToolLoopAgent } from 'ai';
import { object, string } from 'zod/v4';
import { providerOptions } from './providers';
import type { ModelName } from './types';

export const schema = object({
	document: string().describe('Документ в формате HTML для редактора.'),
	chat: string().describe('Сообщения в чат для пользователя.'),
});

export const createAgent = (model: ModelName, userPrompt: string) =>
	new ToolLoopAgent({
		model,
		providerOptions,
		instructions: `Структура ответа. В ответе используй два поля:
			- "chat". Здесь пользователь видит свои и твои сообщения. Пользователь видит чат слева, он занимает 3/12 ширины экрана.
			- "document". Здесь пользователь видит и редактирует содержание документа. Пользователь видит документ справа, он занимает 9/12 ширины экрана.

		Правила работы:
		- Никогда не используй поле "document", если пользователь прямо не просит отредактировать документ.
		- Используй поле "chat":
		  - Когда пользователь задает вопросы или хочет пообщаться.
			- Когда пользователь попросил отредактировать документ. В этом случае нужно написть короткое резуме изменений в документе.
		- Никогда не используй термины HTML в сообщениях для пользователя.

		Ниже правила работы, которые задает пользователь, всегда следуй им.
			${userPrompt}`,

		output: Output.object({ schema }),
	});
