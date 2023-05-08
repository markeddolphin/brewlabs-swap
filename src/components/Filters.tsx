import ButtonGroup from "./inputs/ButtonGroup";
import Toggle from "./inputs/Toggle";

const Filters = () => {
  return (
    <div className="sticky top-0">
      <div className="flex items-center justify-between rounded-xl bg-slate-50 p-2 dark:bg-zinc-900 dark:bg-opacity-75">
        <div className="flex w-full max-w-lg items-center gap-4 ">
          <input
            type="search"
            placeholder="Search Pools"
            className="block w-full rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-800 sm:text-sm"
          />

          <Toggle label="Show staked only" />
        </div>
        <ButtonGroup />
      </div>
    </div>
  );
};

export default Filters;
