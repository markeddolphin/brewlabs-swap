import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import PhoneFrame from "@components/PhoneFrame";
import { ArrowPathRoundedSquareIcon, ChatBubbleLeftRightIcon } from "@heroicons/react/24/outline";
import Container from "./Container";

const PageHero = () => {
  return (
    <section className="relative flex flex-col justify-center bg-zinc-900 pt-32 md:justify-end lg:overflow-hidden lg:pt-32">
      <Container>
        <div className="lg:grid lg:grid-cols-12 lg:gap-x-8 lg:gap-y-20">
          <div className="relative z-10 mx-auto max-w-2xl lg:col-span-7 lg:max-w-none xl:col-span-6">
            <header className="mt-4 mb-4 font-brand sm:mt-5 lg:mt-6">
              <h1 className="bg-gradient-to-r from-amber-200 to-amber-400 bg-clip-text text-4xl text-transparent lg:text-5xl">
                Get ready for the next generation in blockchain utilities
              </h1>
            </header>

            <p className="mb-12 max-w-sm text-base text-dark dark:text-gray-400 sm:mb-4">
              Brewlabs Earn is where you can build your future. We have a unique set of tools and utilities to build
              your portfolio.
            </p>

            <div className="mt-4">
              <div className="flex flex-wrap gap-2">
                <a
                  className="btn-outline btn grow border-amber-200 text-amber-200 sm:grow-0"
                  href="https://t.me/brewlabs"
                  target="_blank"
                >
                  <ChatBubbleLeftRightIcon className="mr-1 h-6 w-6 text-amber-200" />
                  Join our community
                </a>
                <Link className="btn-outline btn grow border-gray-400 sm:grow-0" href="/swap">
                  <ArrowPathRoundedSquareIcon className="mr-1 h-6 w-6" />
                  Swap tokens
                </Link>
              </div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, translateY: 100 }}
            whileInView={{ opacity: 1, translateY: 0 }}
            transition={{
              duration: 0.75,
              delay: 0.5,
            }}
            className="relative mt-10 sm:mt-20 lg:col-span-5 lg:row-span-2 lg:mt-0 xl:col-span-6"
          >
            <div className="-mx-4 h-[380px] px-9 [mask-image:linear-gradient(to_bottom,white_70%,transparent)] sm:mx-0 sm:h-[550px] lg:absolute lg:-inset-x-10 lg:-top-10 lg:-bottom-20 lg:h-auto lg:px-0 lg:pt-10 xl:-bottom-32">
              <PhoneFrame className="mx-auto max-w-[366px]" priority>
                <img src="./images/bridge-promo-mobile.png" alt="Brewlabs Bridge" className="absolute top-2 left-0" />
              </PhoneFrame>
            </div>
          </motion.div>
        </div>
      </Container>

      <div className="waves relative h-16">
        <svg
          className="absolute bottom-0 h-8 w-full"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          viewBox="0 24 150 28 "
          preserveAspectRatio="none"
        >
          <defs>
            <path id="wave-path" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" />
          </defs>

          <g className="wave3">
            <use xlinkHref="#wave-path" x="50" y="9" className="fill-slate-50 dark:fill-zinc-800" />
          </g>
        </svg>
      </div>
    </section>
  );
};

export default PageHero;
