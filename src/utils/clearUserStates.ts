import { Dispatch } from "@reduxjs/toolkit";
import { resetUserState } from "state/global/actions";

export const clearUserStates = (
  dispatch: Dispatch<any>,
  {
    chainId,
    newChainId,
  }: {
    chainId?: number;
    newChainId?: number;
  }
) => {
  dispatch(resetUserState({ chainId, newChainId }));
};
