import { abiERC20 } from "@/entities/Token";
import { keccak256, toUtf8Bytes } from "ethers";
import { useWriteContract, useSignMessage } from "wagmi";
import { useEthersProvider } from "./useEtherProvider";

export const useWeb3 = () => {
  const { signMessageAsync } = useSignMessage();
  const { writeContractAsync } = useWriteContract();
  const provider = useEthersProvider();
  return {
    approve: async (
      address: `0x${string}`,
      contract_address: string,
      value: string
      // setPending?: (arg: boolean) => void,
      // setIsApprove?: (arg: boolean) => void
    ) => {
      try {
        const tx = await writeContractAsync({
          abi: abiERC20,
          address: address,
          functionName: "approve",
          args: [contract_address, value],
        });
        console.log(tx);
      } catch (error) {
        console.log(error);
      }
    },
    signMessage: async (msg: string, setPending: (arg: boolean) => void) => {
      try {
        setPending(true);
        const unsignedHash = keccak256(toUtf8Bytes(msg));
        const message = await signMessageAsync({ message: msg });
        return { signedHash: message, unsignedHash };
      } catch (error) {
        console.log(error);
      } finally {
        setPending(false);
      }
    },
    checkTransactionByHash: async (
      txHash: string,
      updateTransaction: (txHash: string, isCompleted: boolean) => void
    ) => {
      try {
        if (provider) {
          const checkTx = await provider.getTransactionReceipt(txHash);
          if (checkTx && checkTx.status) {
            console.log(checkTx)
            updateTransaction(txHash, true);
            return true;
          } else {
            return false;
          }
        }
        return false;
      } catch (error) {
        console.log(error);
      }
    },
  };
};
