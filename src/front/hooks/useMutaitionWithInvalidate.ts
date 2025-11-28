import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useMutaitionWithInvalidate = <T>(
	fn: ({ data }: { data: T }) => Promise<void>,
	queryKey: string[],
) => {
	const queryClient = useQueryClient();
	return useMutation<void, Error, T>({
		mutationFn: (data) => fn({ data }),
		// Здесь важно ждать invalidateQueries, чтобы mutateAsync завершался по результату
		// не только мутации, но и загрузки новых данных
		onSettled: async (_, error) => {
			if (!error) await queryClient.invalidateQueries({ queryKey });
		},
	});
};
