import type { FC, PropsWithChildren } from 'react';
import { HelmetProvider as ReactHelmetProvider } from 'react-helmet-async';

const helmetContext = {};

export const HelmetProvider: FC<PropsWithChildren<unknown>> = ({
	children,
}) => {
	return (
		<ReactHelmetProvider context={helmetContext}>
			{children}
		</ReactHelmetProvider>
	);
};
