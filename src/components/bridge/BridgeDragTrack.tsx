import { Dispatch, SetStateAction } from "react";
import { motion } from "framer-motion";
import { ChevronDoubleRightIcon } from "@heroicons/react/24/outline";
import { useGlobalState } from "../../state";

const BridgeDragTrack = ({ setLockingFn }: { setLockingFn: Dispatch<SetStateAction<boolean>> }) => {
  // Retrieve global state
  const [networkTo] = useGlobalState("userBridgeTo");
  const [networkFrom] = useGlobalState("userBridgeFrom");

  // TODO: add debounce
  const handleDrag = (pos: any) => {
    if (pos.offset.x > 260) {
      setLockingFn(true);
    }
  };

  return (
    <div className="z-10 col-span-3 -my-6 hidden flex-col items-center justify-between md:relative md:-mx-6 md:flex md:flex-row">
      <div className="absolute h-16 w-16 rounded-full border-2 border-dotted border-gray-400 bg-gray-200 dark:border-gray-700 dark:bg-slate-800"></div>

      <motion.div
        drag="x"
        whileDrag={{ scale: 1.2, zIndex: 90 }}
        whileHover={{ scale: 1.2 }}
        dragSnapToOrigin
        onDrag={(event, info) => handleDrag(info)}
        dragConstraints={{ left: 0, right: 200 }}
        dragTransition={{ bounceStiffness: 600, bounceDamping: 20 }}
        className="rounded-ful relative h-16 w-16 shrink-0 overflow-hidden bg-cover bg-no-repeat hover:cursor-grab"
        style={{
          backgroundImage: `url('${networkFrom.image}')`,
        }}
      ></motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 4, duration: 2 }}
        className="absolute left-16 -top-16 hidden w-36 -rotate-12 font-script text-xl sm:visible"
      >
        <p>Drag to complete the transaction.</p>
      </motion.div>

      <div className="z-10 h-1 w-full animate-pulse border-r-4 border-dotted border-gray-300 dark:border-gray-700 sm:border-t-4" />

      {networkFrom.name !== "No network selected" && (
        <div className="slide-x absolute left-14">
          <ChevronDoubleRightIcon className="h-6 w-6 text-gray-500" />
        </div>
      )}

      <div
        className="h-16 w-16 shrink-0 overflow-hidden rounded-full border-2 border-dotted border-gray-400 bg-gray-200 bg-cover bg-no-repeat dark:border-gray-700 dark:bg-slate-800"
        style={{
          backgroundImage: `url('${networkTo.image}')`,
        }}
      ></div>
    </div>
  );
};

export default BridgeDragTrack;
