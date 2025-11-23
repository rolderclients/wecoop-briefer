import type { AnyFormApi } from '@tanstack/react-form';

export const blurOnError = ({ formApi }: { formApi: AnyFormApi }) => {
	const inputNames = [
		...new Set(
			Object.values(formApi.state.errorMap).flatMap((i) => Object.keys(i)),
		),
	];
	for (const inputName of inputNames) {
		const input = document.querySelector(
			`#form input[name="${inputName}"]`,
		) as HTMLInputElement | null;
		if (input) {
			input.focus();
			break;
		}
	}
};
