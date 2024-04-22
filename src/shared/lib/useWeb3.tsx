import { abiERC20 } from "@/entities/Token";
import { useWriteContract } from "wagmi";

export const useWeb3 = () => {
  const { writeContract } = useWriteContract();
  return {
    approve: async (
      address: `0x${string}`,
      contract_address: string,
      value: string,
      // setPending?: (arg: boolean) => void,
      // setIsApprove?: (arg: boolean) => void
    ) => {
      try {
        const tx = await writeContract({
          abi: abiERC20,
          address: address,
          functionName: "approve",
          args: [contract_address, value],
        });
        console.log(tx)
      } catch (error) {
        console.log(error);
      }
    },
  };
};
