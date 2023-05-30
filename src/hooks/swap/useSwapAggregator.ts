import { Currency, CurrencyAmount, TokenAmount, Token } from "@brewlabs/sdk";
import useENS from "@hooks/ENS/useENS";
import { ethers } from "ethers";
import useActiveWeb3React from "hooks/useActiveWeb3React";
import { useEffect, useMemo, useState } from "react";
import { Field } from "state/swap/actions";
import { useTransactionAdder } from "state/transactions/hooks";
import { calculateGasMargin, isAddress, shortenAddress } from "utils";
import { getAggregatorContract } from "utils/contractHelpers";
import { makeBigNumber } from "utils/functions";
import { useSigner } from "wagmi";

export const useSwapAggregator = (
  currencies: { [field in Field]?: Currency },
  amountIn: CurrencyAmount,
  recipientAddressOrName: string | null
) => {
  const { account, chainId, library } = useActiveWeb3React();

  const { data: signer } = useSigner();

  const { address: recipientAddress } = useENS(recipientAddressOrName);
  const recipient = recipientAddressOrName === null ? account : recipientAddress;

  const contract = useMemo(() => {
    if (!chainId) return null;
    return getAggregatorContract(chainId, signer);
  }, [chainId, signer]);

  const callParams = useMemo(() => {
    if (!amountIn || !currencies || !currencies[Field.INPUT] || !currencies[Field.OUTPUT]) return null;
    const amountInWei = makeBigNumber(amountIn.toExact(), amountIn.currency.decimals);
    return {
      args: [
        amountInWei, // amountIn
        currencies[Field.INPUT]?.wrapped.address, // tokenIn
        currencies[Field.OUTPUT]?.wrapped.address, // tokenOut
        3, // maxSteps
      ],
      value: currencies[Field.INPUT].isNative ? amountInWei : null,
    };
  }, [amountIn, currencies]);

  const [query, setQuery] = useState<any>();

  useEffect(() => {
    if (!contract || !callParams) return;
    const methodName = "findBestPath";
    contract[methodName](...callParams.args)
      .then((response: any) => {
        const outputValue = response.amounts[response.amounts.length - 1];
        const outputAmount =
          currencies[Field.OUTPUT] instanceof Token
            ? new TokenAmount(currencies[Field.OUTPUT], outputValue)
            : new CurrencyAmount(currencies[Field.OUTPUT], outputValue);
        const inputValue = response.amounts[0];
        const inputAmount =
          currencies[Field.INPUT] instanceof Token
            ? new TokenAmount(currencies[Field.INPUT], inputValue)
            : new CurrencyAmount(currencies[Field.INPUT], inputValue);
        if (outputAmount)
          setQuery({
            inputAmount,
            outputAmount,
            amounts: response.amounts,
            path: response.path,
            adapters: response.adapters,
          });
      })
      .catch((error: any) => {
        console.error(error);
      });
  }, [contract, callParams]);

  const addTransaction = useTransactionAdder();
  return useMemo(() => {
    if (!chainId || !library || !account || !signer || !contract || !callParams) {
      return { callback: null, query: query, error: "Missing dependencies" };
    }
    return {
      callback: async function onSwap() {
        const args = [
          [query.amounts[0], query.amounts[query.amounts.length - 1], query.path, query.adapters],
          recipient,
        ];
        const options = callParams.value ? { value: callParams.value } : {};
        const methodName = currencies[Field.INPUT].isNative
          ? "swapNoSplitFromETH"
          : currencies[Field.OUTPUT].isNative
          ? "swapNoSplitToETH"
          : "swapNoSplit";
        const gasEstimate = await contract.estimateGas[methodName](...args, options);
        return contract[methodName](...args, {
          gasLimit: calculateGasMargin(gasEstimate),
          ...(options.value ? { value: options.value, from: account } : { from: account }),
        })
          .then((response: any) => {
            const inputSymbol = currencies[Field.INPUT].wrapped.symbol;
            const outputSymbol = currencies[Field.OUTPUT].wrapped.symbol;
            const inputAmount = amountIn.toSignificant(3);
            const outputAmount = ethers.utils.formatUnits(response.data, currencies[Field.OUTPUT].decimals);

            const base = `Swap ${inputAmount} ${inputSymbol} for ${outputAmount} ${outputSymbol}`;
            const withRecipient =
              recipient === account
                ? base
                : `${base} to ${
                    recipientAddressOrName && isAddress(recipientAddressOrName)
                      ? shortenAddress(recipientAddressOrName)
                      : recipientAddressOrName
                  }`;

            addTransaction(response, {
              summary: withRecipient,
            });

            return response.hash;
          })
          .catch((error: any) => {
            // if the user rejected the tx, pass this along
            if (error?.code === 4001) {
              throw new Error("Transaction rejected.");
            } else {
              // otherwise, the error was unexpected and we need to convey that
              console.error(`Swap failed`, error, methodName, args, options.value);
              throw new Error(`Swap failed: ${error.message}`);
            }
          });
      },
      query,
    };
  }, [library, account, chainId, recipient, contract, query, callParams, recipientAddressOrName, addTransaction]);
};
