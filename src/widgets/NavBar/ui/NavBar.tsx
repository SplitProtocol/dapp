import { navLinks } from "@/shared/lib/consts";
import { NavLink } from "@/shared/ui";
import { useLocation } from "react-router-dom";

export const NavBar = () => {
  const location = useLocation();
  return (
    <nav className="md:flex hidden flex-row items-center gap-x-6">
      {navLinks.map((link) => (
        <NavLink
          key={link.label}
          path={location.pathname}
          href={link.path}
          ariaLabel={link.label}
          label={link.label}
        />
      ))}
    </nav>
  );
};
