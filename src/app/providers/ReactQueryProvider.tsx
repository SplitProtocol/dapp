import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, type FC, type PropsWithChildren } from 'react';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

export const ReactQueryProvider: FC<PropsWithChildren<unknown>> = ({
	children,
}) => {
	const [queryClient] = useState(
		new QueryClient({
			defaultOptions: {
				queries: {
					staleTime: 1000 * 60,
					gcTime: 10 * 1000 * 60,
				},
			},
		}),
	);

	return (
		<QueryClientProvider client={queryClient}>
			{children}
			<ReactQueryDevtools />
		</QueryClientProvider>
	);
};
