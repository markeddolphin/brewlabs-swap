import { useState } from "react";
import { motion } from "framer-motion";
import LogoIcon from "@components/LogoIcon";
import useIsMobile from "@hooks/useIsMobile";

import { PlayCircleIcon } from "@heroicons/react/24/outline";

import Modal from "../MotionModal";

const CardVideo = ({ cardId, youtubeId }: { cardId: string; youtubeId: string }) => {
  const isMobile = useIsMobile();
  const [selected, setSelected] = useState(false);

  const closeSelected = () => {
    setSelected(false);
  };

  return (
    <>
      <motion.button
        layoutId={cardId}
        onClick={() => {
          if (isMobile) {
            window.open(`https://www.youtube.com/watch?v=${youtubeId}`, "_blank");
            return;
          }
          setSelected(true);
        }}
        className="group relative w-full overflow-hidden rounded-2xl border border-gray-700"
      >
        <div className="w-100 flex h-56 items-center justify-center rounded-xl bg-gradient-to-tr from-zinc-800 to-zinc-900 sm:h-64">
          <div>
            <LogoIcon classNames="w-10 text-dark dark:text-brand" />
            <h5 className="text-2xl">BREWLABS STAKING</h5>
            <div className="flex items-center">
              <PlayCircleIcon className="mr-1 h-6 w-6" />
              <p className="text-sm dark:text-gray-500">Find out how staking works</p>
            </div>
          </div>
        </div>
      </motion.button>

      {selected && (
        <Modal open={selected} closeFn={closeSelected} layoutId={cardId}>
          <iframe
            className="aspect-video w-full"
            src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1`}
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </Modal>
      )}
    </>
  );
};

export default CardVideo;
