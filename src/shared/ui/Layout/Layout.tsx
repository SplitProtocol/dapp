import { clsxMerge } from "@/shared/lib/clsxMerge";
import type{ FC, ReactNode } from "react";
import { Outlet } from "react-router-dom";

type LayoutProps = {
  headerSlot?: ReactNode;
  isOnePager?: boolean;
};

const layoutMainClassName = "flex flex-col min-h-screen w-full items-center pt-[8rem] lg:pt-[3rem]";

export const Layout: FC<LayoutProps> = (props) => {
  const { headerSlot, isOnePager = false } = props;

  const mergedMainClassNames = clsxMerge(layoutMainClassName);

  if (isOnePager) {
    return (
      <div className="flex flex-col items-center justify-center w-full min-h-screen">
        <Outlet />
      </div>
    );
  }

  return (
    <>
      {headerSlot}
      <main className={mergedMainClassNames}>
        <div className="flex flex-col w-full py-8 items-center">
          <Outlet />
        </div>
      </main>
    </>
  );
};
