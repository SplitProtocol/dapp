import { TokenChart, useTokenChartStore } from "@/entities/Token";
import { SwapForm } from "@/features/SwapForm";
import { Switch, Tabs } from "@mantine/core";
import { useState } from "react";
import { useAccount } from "wagmi";
import { TradeViewActiveTab } from "../model/types";
import { clsxMerge } from "@/shared/lib/clsxMerge";
import { useMedia } from "react-use";
import { ReferralButton } from "@/features/ReferralButton";

export const TradeView = () => {
  const { isExpertMode, setIsExpertMode } = useTokenChartStore();
  const isMobile = useMedia("only screen and (max-width: 768px)", false);
  const { chainId, address } = useAccount();
  const [activeTab, setActiveTab] = useState<string | null>(
    TradeViewActiveTab.SWAP
  );
  return (
    <div className="flex flex-col w-full items-center">
      {address && <ReferralButton className="mb-2" />}
      <div className="flex relative flex-row w-full justify-center items-stretch gap-4">
        {isExpertMode && chainId && (
          <div
            className={clsxMerge(
              "flex flex-col w-full rounded-xl bg-gray-800 px-8 py-8 h-auto",
              isMobile && isExpertMode && "z-20 absolute top-[3rem] h-full"
            )}
          >
            <TokenChart chain={chainId} />
          </div>
        )}
        <div className="flex flex-col w-full max-w-[28rem] rounded-xl bg-gray-800 px-4 py-4 md:px-8 md:py-8">
          {activeTab === TradeViewActiveTab.SWAP && (
            <Switch
              label="Expert mode"
              checked={isExpertMode}
              onChange={(event) => setIsExpertMode(event.currentTarget.checked)}
              color="#F29212"
              classNames={{
                label: "text-white",
                track: "bg-[rgb(18,18,18)] border-[rgb(18,18,18)]",
                thumb: "bg-primary border-primary",
              }}
            />
          )}
          <Tabs
            color="#F29212"
            value={activeTab}
            onChange={setActiveTab}
            classNames={{
              list: "before:hidden",
              tab: "outline-none hover:bg-transparent text-white/50 data-[active=true]:text-white text-md px-0 mr-4",
            }}
          >
            <Tabs.List>
              <Tabs.Tab value={TradeViewActiveTab.SWAP}>Swap</Tabs.Tab>
              {/* <Tabs.Tab value={TradeViewActiveTab.LIMIT}>Limit</Tabs.Tab> */}
            </Tabs.List>

            <Tabs.Panel value={TradeViewActiveTab.SWAP} pt="xs">
              <SwapForm />
            </Tabs.Panel>

            {/* <Tabs.Panel value={TradeViewActiveTab.LIMIT} pt="xs">
            Limit
          </Tabs.Panel> */}
          </Tabs>
        </div>
      </div>
    </div>
  );
};
