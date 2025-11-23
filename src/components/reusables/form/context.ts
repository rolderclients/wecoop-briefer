import { createFormHook, createFormHookContexts } from '@tanstack/react-form';
import { CancelButton, SubmitButton, SubscribeButton } from './buttons';
import { SelectField, TextField, TextPassowrdField } from './fields';

const { fieldContext, useFieldContext, formContext, useFormContext } =
	createFormHookContexts();

const { useAppForm } = createFormHook({
	fieldComponents: {
		TextField,
		TextPassowrdField,
		SelectField,
	},
	formComponents: {
		SubmitButton,
		CancelButton,
		SubscribeButton,
	},
	fieldContext,
	formContext,
});

export { useAppForm, useFieldContext, useFormContext };
