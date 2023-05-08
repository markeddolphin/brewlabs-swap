import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CalculatorIcon,
  LockClosedIcon,
  ArrowDownCircleIcon,
  PlusCircleIcon,
  MinusCircleIcon,
} from "@heroicons/react/24/outline";
import ProgressBar from "./ProgressBar";

// TODO: Rolling numbers
const ExpandableRow = ({ data }: { data: any }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div initial={false} className="mt-4">
      <div className="mt-2 w-fit">
        <h5 className="rounded-t-lg px-3 py-2 text-sm tracking-wide dark:bg-zinc-900 dark:bg-opacity-60">
          {data.name}
        </h5>
      </div>

      <div className="rounded-2xl rounded-tl-none bg-gray-100 py-3 px-4 font-brand dark:bg-zinc-900 dark:bg-opacity-60">
        <div data-name="top-row" className="flex justify-between gap-4">
          <div className="grid content-between items-center">
            <div className="todo:image h-16 w-16 rounded-full bg-slate-600 dark:bg-brand"></div>
          </div>

          <div className="text-sm">
            <ul>
              <li>Stake {data.stakeCoin}</li>
              <li>Earn {data.earnCoin}</li>
              <li>
                Lock{" "}
                <span className="font-bold text-[#f36d0f] dark:text-brand">
                  {data.lockPeriodDays}
                </span>{" "}
                Days
              </li>
            </ul>
          </div>

          <div className="text-sm">
            <h5 className="mb-2 tracking-wide">Earned</h5>
            <ul>
              <li className="text-[#f36d0f] dark:text-brand">1,8343,0976</li>
              <li>~ 23.90 USD</li>
            </ul>
          </div>

          <div className="text-sm">
            <h5 className="mb-2 tracking-wide">APR</h5>

            <div className="flex items-center gap-2">
              <span className="text-base">18.56%</span>

              <button>
                <CalculatorIcon className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="text-sm">
            <h5 className="mb-2 tracking-wide">Total staked</h5>
            <ul>
              <li className="text-[#f36d0f] dark:text-brand">5,8343,0976</li>
              <li>~ 2323.90 USD</li>
            </ul>
          </div>

          <div className="text-sm">
            <h5 className="mb-2 inline-flex items-center tracking-wide">
              <LockClosedIcon className="mr-1 h-4 w-4" /> Ends in
            </h5>

            <figure>
              <figcaption className="mb-2 text-xs">12 of 60 Days</figcaption>
              {/* <figcaption className="mb-2 text-xs">1,125,364 Blocks</figcaption> */}
              <ProgressBar percentage={data.endsInPercentage} />
            </figure>
          </div>

          {/* <button className="flex shrink-0 grow-0 items-center self-center rounded-2xl border border-brand px-3 py-1">
            <LightningBoltIcon className="mr-2 h-4 w-4" />
            <span className="whitespace-nowrap text-xs">Zap Stake</span>
          </button> */}

          <button className="flex shrink-0 grow-0 items-center justify-between gap-3 self-center rounded-2xl border border-gray-600 py-1 px-2">
            <MinusCircleIcon className="h-5 w-5" />
            <span className="whitespace-nowrap">Stake</span>
            <PlusCircleIcon className=" h-5 w-5" />
          </button>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center"
          >
            <span className="sr-only">More information</span>
            <ArrowDownCircleIcon className="ml-4 h-6 w-6 dark:text-brand" />
          </button>
        </div>
        <AnimatePresence initial={false}>
          {isExpanded && (
            <motion.section
              key="content"
              initial="collapsed"
              animate="open"
              exit="collapsed"
              variants={{
                open: { opacity: 1, height: "auto" },
                collapsed: { opacity: 0, height: 0 },
              }}
              transition={{ duration: 0.8, ease: [0.04, 0.62, 0.23, 0.98] }}
              className="relative"
            >
              <p className="h-48">This is a bunch of text and stuff</p>
            </motion.section>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default ExpandableRow;
