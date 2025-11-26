import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useQueryWithInvalidate = <T>(
	fn: ({ data }: { data: T }) => Promise<void>,
	queryKey: string[],
) => {
	const queryClient = useQueryClient();
	return useMutation<void, Error, T>({
		mutationFn: (data) => fn({ data }),
		onSettled: (_, error) => {
			if (!error) queryClient.invalidateQueries({ queryKey });
		},
	});
};
