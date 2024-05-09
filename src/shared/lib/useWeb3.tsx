import { abiERC20 } from "@/entities/Token";
import { keccak256, toUtf8Bytes } from "ethers";
import { useWriteContract, useSignMessage } from "wagmi";
import { useEthersProvider } from "./useEtherProvider";
import { PendingTransaction } from "@/entities/Transaction";
import { notification, notificationTitles } from "../helpers/notificationMessages";

export const useWeb3 = () => {
  const { signMessageAsync } = useSignMessage();
  const { writeContractAsync } = useWriteContract();
  const provider = useEthersProvider();
  return {
    approve: async (
      address: `0x${string}`,
      contract_address: string,
      chainId: number,
      value: string,
      setPending: (arg: boolean) => void,
      setTransaction: (transaction: PendingTransaction) => void
    ) => {
      try {
        setPending(true);
        const tx = await writeContractAsync({
          abi: abiERC20,
          address: address,
          functionName: "approve",
          args: [contract_address, value],
        });
        if (tx) {
          setTransaction({ txHash: tx, isCompleted: false, chainId });
          console.log(tx);
          return tx;
        }
        return false;
      } catch (error) {
        console.log(error);
      } finally {
        setPending(false);
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
      // chainId: number,
      updateTransaction: (txHash: string, isCompleted: boolean) => void
    ) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
     
      try {
        if (provider) {
          const checkTx = await provider.getTransactionReceipt(txHash);
          console.log(checkTx)
          if (checkTx && checkTx.status) {
            updateTransaction(txHash, true);
            notification.success(notificationTitles.success, `Your transaction has been successfully completed! Tx:${txHash}`)
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
