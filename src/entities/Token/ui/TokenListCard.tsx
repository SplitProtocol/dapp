import { FC } from "react";
import { Token, TokenListItem } from "../model/types";
import {
  networkScannerLink,
  renderNewtworkLogoByChainId,
} from "@/entities/Network";
import { convertAddressWallet } from "@/shared/lib/utils";
import { IconExternalLink } from "@tabler/icons-react";

type TokenListCardProps = {
  token: TokenListItem;
  onSetDestination: (token: Token) => void;
};

export const TokenListCard: FC<TokenListCardProps> = (props) => {
  const { token, onSetDestination } = props;

  const handleSetDestination = () => {
    const destination: Token = {
      symbol: token.symbol,
      decimals: token.decimals,
      logoURI: token.logoURI || "",
      name: token.name,
      address: token.address,
      chainId: token.chainId,
    };
    onSetDestination(destination);
  };

  return (
    <li
      className="flex flex-row items-center px-2 py-2 rounded-lg bg-transparent hover:bg-gray-800 cursor-pointer token-card"
      onClick={handleSetDestination}
    >
      <div className="flex flex-col w-[2.5rem] h-[2.5rem] relative shrink-0">
        <img
          src={token.logoURI}
          alt={token.name}
          className="rounded-full w-full h-full"
        />
        <div className="flex justify-center items-center rounded-full w-[1.125rem] h-[1.125rem] bg-gray-500 px-[0.125rem] py-[0.125rem] absolute right-[-2px] bottom-[-2px]">
          <div className="flex justify-center items-center bg-gray-600 w-full h-full rounded-full">
            {renderNewtworkLogoByChainId(token.chainId)}
          </div>
        </div>
      </div>
      <div className="flex flex-col w-full pl-4">
        <div className="text-md text-left font-medium text-white">
          {token.symbol}
        </div>
        <div className="flex flex-col w-full overflow-hidden h-[1rem]">
          <div className="flex flex-col w-full animate-address">
            <div className="text-xs text-left text-white/60">{token.name}</div>
            <div className="flex flex-row items-center text-xs text-left text-white/60 gap-x-2">
              {convertAddressWallet(token.address, 8)}
              <a
                href={`${
                  networkScannerLink[
                    token.chainId as keyof typeof networkScannerLink
                  ]
                }/${token.address}`}
                target="_blank"
                className="opacity-50 hover:opacity-100 tansition-all"
              >
                <IconExternalLink size={14} color="white" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
};
