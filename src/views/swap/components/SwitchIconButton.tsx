import { ChevronDownIcon } from "@heroicons/react/24/outline";

type SwitchIconButtonType = {
  onSwitch: () => void;
};

const SwitchIconButton = ({ onSwitch }: SwitchIconButtonType) => {
  return (
    <div className="z-10 -my-3 flex justify-center">
      <button className="rounded-lg bg-primary px-1 hover:bg-primary/75" onClick={onSwitch}>
        <ChevronDownIcon className="h-6 w-6 dark:text-gray-900" />
      </button>
    </div>
  );
};

export default SwitchIconButton;
