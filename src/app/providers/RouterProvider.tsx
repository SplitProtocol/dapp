// import { PortfolioPage } from '@/pages/PortfolioPage';
import { TradePage } from '@/pages/TradePage';
import { navigationRoutes } from '@/shared/routes/navigationRoutes';
import { Layout } from '@/shared/ui';
import { Header } from '@/widgets/Header';
import { Navigate, useRoutes } from 'react-router-dom';

export const RouterProvider = () => {
	return useRoutes([
		{
			element: (
				<Layout headerSlot={<Header />} />
			),
			children: [
				// {
				// 	path: navigationRoutes.portfolio,
				// 	element: <PortfolioPage />,
				// },
				{
					path: navigationRoutes.trade,
					element: <TradePage />
				},
				{
					path: '*',
					element: (
						<Navigate to={navigationRoutes.trade} replace />
					),
				},
			],
		},
	]);
};
