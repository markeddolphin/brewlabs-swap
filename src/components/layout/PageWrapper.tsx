import { ReactNode } from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import PageMeta from "./PageMeta";

const PageWrapper = ({ children }: { children: ReactNode }) => {
  const router = useRouter();

  const variants = {
    hidden: {
      opacity: 0,
      y: 1500,
      transition: {
        y: { duration: 0.5 },
        default: { ease: [0.6, -0.05, 0.01, 0.99] },
      },
    },
    enter: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.25,
        y: { duration: 0.5 },
        default: { ease: [0.6, -0.05, 0.01, 0.99] },
      },
    },
    exit: {
      opacity: 0,
      y: -500,
      transition: {
        y: { duration: 0.75 },
        default: { ease: [0.6, -0.05, 0.01, 0.99] },
      },
    },
  };

  const variantsHome = {
    hidden: { opacity: 0, y: 0 },
    enter: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 0 },
  };

  return (
    <>
      <PageMeta />
      <motion.div
        id="page_wrapper"
        initial="hidden"
        animate="enter"
        exit="exit"
        variants={router.pathname === "/" ? variantsHome : variants}
        onAnimationStart={() => document.body.classList.add("overflow-hidden")}
        onAnimationComplete={() => document.body.classList.remove("overflow-hidden")}
        className="relative z-0 min-h-screen w-full flex-1 xl:order-last"
      >
        {children}
      </motion.div>
    </>
  );
};

export default PageWrapper;
