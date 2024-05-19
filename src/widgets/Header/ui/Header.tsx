import { ConnectButton } from "@/features/ConnectButton";
import { NetworkButton } from "@/features/NetworkButton";
import { navigationRoutes } from "@/shared/routes/navigationRoutes";
import { NavBar } from "@/widgets/NavBar";
import { Image, Menu, Burger } from "@mantine/core";
import { Link } from "react-router-dom";
import { useMedia } from "react-use";

export const Header = () => {
  const isMobile = useMedia("only screen and (max-width: 768px)", false);
  return (
    <header className="flex flex-col fixed top-0 left-0 items-center w-full py-4 px-4 z-[100] bg-[#0A0A0A]">
      <div className="flex flex-row w-full justify-between items-center max-w-[81.25rem]">
        <Link to={navigationRoutes.home}>
          <Image
            src="/images/logo-big.webp"
            alt="Split"
            className="md:flex hidden h-[5.375rem]"
          />
          <Image
            src="/images/logo-mobile.webp"
            alt="Split"
            className="md:hidden flex h-[3.375rem]"
          />
        </Link>
        <NavBar />
        <div className="flex flex-row items-center gap-x-3">
          <NetworkButton />
          <ConnectButton />
          {isMobile && (
            <Menu
              shadow="md"
              width={200}
              position="bottom-end"
              classNames={{
                dropdown: "bg-gray-800 border-none",
                itemLabel: "text-white",
                item: "hover:bg-white/5 bg-transparent"
              }}
            >
              <Menu.Target>
                <Burger
                  classNames={{
                    burger:
                      "bg-white before:content-[''] before:bg-white after:content-[''] after:bg-white",
                  }}
                />
              </Menu.Target>

              <Menu.Dropdown>
                {/* <Menu.Item component={Link} to={navigationRoutes.portfolio}>
                  Portfolio
                </Menu.Item>
                <Menu.Item component={Link} to={navigationRoutes.staking}>
                  Staking SPLX
                </Menu.Item> */}
                <Menu.Item component={Link} to={navigationRoutes.trade}>
                  Trade
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          )}
        </div>
      </div>
    </header>
  );
};
