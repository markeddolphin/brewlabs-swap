import MulticallUpdater from "state/multicall/updater";
import TokenListUpdater from "state/lists/updater";

export function Updaters() {
  return (
    <>
      <MulticallUpdater />
      <TokenListUpdater />
    </>
  );
}
