import { useContext } from "react";

import { SwapContext } from "contexts/SwapContext";
import CreateLiquidityOption from "./components/addLiquidity/CreateLiquidityOption";
import BasicLiquidity from "./components/addLiquidity/BasicLiquidity";

export default function AddLiquidityPanel() {
  const { addLiquidityStep }: any = useContext(SwapContext);

  return (
    <>
      {addLiquidityStep === "default" || addLiquidityStep === "CreateNewLiquidityPool" ? (
        <CreateLiquidityOption></CreateLiquidityOption>
      ) : (
        <BasicLiquidity></BasicLiquidity>
      )}
    </>
  );
}
