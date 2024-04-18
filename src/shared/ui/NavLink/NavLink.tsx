import { Link } from "react-router-dom";
import { NavLink as MantineNavLink } from "@mantine/core";
import type { FC } from "react";

import { type NavLinkTypes } from "@/shared/lib/consts";

type NavLinkProps = NavLinkTypes & {
	href: string;
	ariaLabel?: string;
};

export const NavLink: FC<NavLinkProps> = (props) => {
  const { path, label, href, ariaLabel } = props;

  const isActive = path.startsWith(href || "");

  return (
    <MantineNavLink
      component={Link}
      to={href}
      active={isActive}
      aria-label={ariaLabel}
      label={label}
      classNames={{
				root: 'bg-transparent hover:bg-transparent text-white/50 hover:text-white rounded-lg data-[active=true]:hover:bg-transparent data-[active=true]:text-white',
				label: 'whitespace-nowrap font-bold text-md',
			}}
    />
  );
};
