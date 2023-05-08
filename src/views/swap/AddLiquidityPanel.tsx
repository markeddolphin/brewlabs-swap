import { useContext } from "react";

import { SwapContext } from "contexts/SwapContext";
import CreateLiquidityOption from "./components/addLiquidity/CreateLiquidityOption";
import BasicLiquidity from "./components/addLiquidity/BasicLiquidity";
import DeployYieldFarm from "./components/addLiquidity/DeployYieldFarm";

export default function AddLiquidityPanel() {
  const { addLiquidityStep }: any = useContext(SwapContext);

  return (
    <>
      {addLiquidityStep < 2 ? (
        <CreateLiquidityOption></CreateLiquidityOption>
      ) : (
        <BasicLiquidity></BasicLiquidity>
      )}
    </>
  );
}
