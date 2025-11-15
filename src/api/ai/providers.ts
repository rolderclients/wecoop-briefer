import type { AnthropicProviderOptions } from '@ai-sdk/anthropic';
import type { GoogleGenerativeAIProviderOptions } from '@ai-sdk/google';

export const providerOptions = {
	anthropic: {
		thinking: { type: 'disabled' },
	} satisfies AnthropicProviderOptions,
	google: {
		thinkingConfig: { includeThoughts: false },
	} satisfies GoogleGenerativeAIProviderOptions,
};
