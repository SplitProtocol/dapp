import { TokenChart, useTokenChartStore } from "@/entities/Token";
import { SwapForm } from "@/features/SwapForm";
import { Switch, Tabs } from "@mantine/core";
import { useState } from "react";
import { useAccount } from "wagmi";
import { TradeViewActiveTab } from "../model/types";

export const TradeView = () => {
  const { isExpertMode, setIsExpertMode } = useTokenChartStore();
  const { chainId } = useAccount();
  const [activeTab, setActiveTab] = useState<string | null>(
    TradeViewActiveTab.SWAP
  );
  return (
    <div className="flex flex-row w-full justify-center items-stretch gap-4">
      {isExpertMode && chainId && (
        <div className="flex flex-col w-full rounded-xl bg-gray-800 px-8 py-8 h-auto">
          <TokenChart chain={chainId} />
        </div>
      )}
      <div className="flex flex-col w-full max-w-[28rem] rounded-xl bg-gray-800 px-4 py-4 md:px-8 md:py-8">
        {activeTab === TradeViewActiveTab.SWAP && <Switch
          label="Expert mode"
          checked={isExpertMode}
          onChange={(event) => setIsExpertMode(event.currentTarget.checked)}
          color="#F29212"
          classNames={{ label: "text-white" }}
        />}
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
            <Tabs.Tab value={TradeViewActiveTab.LIMIT}>Limit</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value={TradeViewActiveTab.SWAP} pt="xs">
            <SwapForm />
          </Tabs.Panel>

          <Tabs.Panel value={TradeViewActiveTab.LIMIT} pt="xs">
            Limit
          </Tabs.Panel>
        </Tabs>
      </div>
    </div>
  );
};
