import { Dispatch, SetStateAction } from "react";
import { motion, PanInfo } from "framer-motion";
import { useGlobalState } from "../../state";
import { ChevronDoubleRightIcon } from "@heroicons/react/24/outline";

const BridgeDragButton = ({ setLockingFn }: { setLockingFn: Dispatch<SetStateAction<boolean>> }) => {
  // Retrieve global state
  const [networkTo] = useGlobalState("userBridgeTo");
  const [networkFrom] = useGlobalState("userBridgeFrom");

  // TODO: add debounce
  // TODO: make more accurate
  const handleDrag = (pos: PanInfo) => {
    if (pos.offset.x > 260) {
      setLockingFn(true);
    }
  };

  return (
    <div className="animate__animated animate__fadeInUp fixed bottom-0 left-0 right-0 w-full bg-gradient-to-t from-slate-800 to-transparent">
      <div className="mx-auto mt-4 flex w-full max-w-sm items-center justify-between rounded-full border-t border-slate-800 bg-zinc-900 p-1 md:hidden">
        <motion.button
          drag="x"
          whileDrag={{ scale: 1.2, zIndex: 90 }}
          whileHover={{ scale: 1.2 }}
          dragSnapToOrigin
          onDrag={(event, info) => handleDrag(info)}
          dragConstraints={{ left: 0, right: 200 }}
          dragTransition={{ bounceStiffness: 600, bounceDamping: 20 }}
          className="rounded-ful h-12 w-12 shrink-0 overflow-hidden bg-cover bg-no-repeat hover:cursor-grab"
          style={{
            backgroundImage: `url('${networkFrom.image}')`,
          }}
        ></motion.button>

        <span className="relative mb-1">Swipe to complete transfer</span>
        <div className="slide-x absolute left-14">
          <ChevronDoubleRightIcon className="h-6 w-6 text-gray-500" />
        </div>

        <div
          className="h-12 w-12 shrink-0 overflow-hidden rounded-full bg-cover bg-no-repeat dark:bg-slate-800"
          style={{
            backgroundImage: `url('${networkTo.image}')`,
          }}
        ></div>
      </div>
    </div>
  );
};

export default BridgeDragButton;
