import { navigationRoutes } from '@/shared/routes/navigationRoutes';

export type NavLinkTypes = {
	label: string;
	path: string;
};

export const navLinks: NavLinkTypes[] = [
	// {
	// 	label: 'Portfolio',
	// 	path: navigationRoutes.portfolio,
	// },
  // {
	// 	label: 'Staking SPLX',
	// 	path: navigationRoutes.staking,
	// },
  {
		label: 'Trade',
		path: navigationRoutes.trade,
	},
];