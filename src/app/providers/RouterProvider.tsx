import { useEffect } from 'react';
import { TradePage } from '@/pages/TradePage';
import { navigationRoutes } from '@/shared/routes/navigationRoutes';
import { Layout } from '@/shared/ui';
import { Header } from '@/widgets/Header';
import { Navigate, useRoutes, useLocation } from 'react-router-dom';

export const RouterProvider = () => {
	const location = useLocation();

  const routes = useRoutes([
    {
      element: <Layout headerSlot={<Header />} />,
      children: [
        {
          path: navigationRoutes.trade,
          element: <TradePage />
        },
        {
          path: '*',
          element: <Navigate to={navigationRoutes.trade} replace />
        },
      ],
    },
  ]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const ref = params.get('ref');
    if (ref && typeof window !== 'undefined') {
      localStorage.setItem(import.meta.env.VITE_INVITER_KEY, ref);
    }
  }, [location.search]);

  return routes;
};