import { ActionIcon as MantineActionButton } from "@mantine/core";
import { IconCircleChevronLeft } from "@tabler/icons-react";
import { FC } from "react";
import { SwapHeaderCaptions } from "../model/types";

type SwapFormHeaderProps = {
  activeScreen: SwapHeaderCaptions;
  onBack: () => void;
};

export const SwapFormHeader: FC<SwapFormHeaderProps> = (props) => {
  const { activeScreen, onBack } = props;
  return (
    <div className="flex flex-row w-full items-center gap-x-4 mb-4">
      {activeScreen !== SwapHeaderCaptions.HOME && (
        <MantineActionButton variant="subtle" size="md" color="white" onClick={onBack}>
          <IconCircleChevronLeft size={20} />
        </MantineActionButton>
      )}
      <div className="text-lg font-semibold text-left text-white">
        {activeScreen}
      </div>
    </div>
  );
};
