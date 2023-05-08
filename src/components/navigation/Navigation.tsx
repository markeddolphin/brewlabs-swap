import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import clsx from "clsx";
import Link from "next/link";
import LogoIcon from "../LogoIcon";
import ConnectWallet from "../wallet/ConnectWallet";
// import ThemeSwitcher from "../ThemeSwitcher";
import DynamicHeroIcon, { IconName } from "../DynamicHeroIcon";
import { setGlobalState } from "../../state";
import { navigationData, navigationExtraData } from "../../config/constants/navigation";
import { BuildingOffice2Icon, DocumentTextIcon, PaperAirplaneIcon } from "@heroicons/react/24/outline";

const Navigation = ({ slim }: { slim?: boolean }) => {
  const router = useRouter();

  // Close the mobile navigation when navigating
  useEffect(() => {
    router.events.on("routeChangeStart", () => setGlobalState("mobileNavOpen", false));
  }, [router.events]);

  return (
    <div className="flex min-h-0 flex-1 flex-col border-r border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-zinc-900">
      <div className="flex flex-1 flex-col pt-5 pb-4">
        <div className="flex flex-shrink-0 items-center px-4">
          <LogoIcon classNames="w-12 text-dark dark:text-brand" />
        </div>
        <nav className="mt-5 flex flex-1 flex-col justify-between" aria-label="Sidebar">
          <div className="space-y-1 px-2 font-brand tracking-wider">
            {navigationData.map((item) => (
              <Link href={item.href} passHref key={item.name}>
                <motion.a
                  layout="position"
                  whileTap={{ scale: 0.9 }}
                  whileHover={{ scale: 1.05 }}
                  data-tip={item.name}
                  target={item.external ? "_blank" : "_self"}
                  rel={item.external ? "noopener noreferrer" : ""}
                  className={clsx(
                    item.href === router.pathname
                      ? "bg-gray-200 text-gray-900 dark:bg-gray-800 dark:text-gray-400"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-500 dark:hover:bg-gray-800",
                    "group flex items-center rounded-md px-2 py-2 text-sm font-medium home:tooltip home:tooltip-right"
                  )}
                >
                  <DynamicHeroIcon
                    icon={item.icon as IconName}
                    className={clsx(
                      slim
                        ? "h-5 w-5 text-gray-500 dark:text-gray-400"
                        : "mr-3 h-7 w-7 text-gray-600 group-hover:text-gray-500 dark:text-gray-500"
                    )}
                  />
                  <span className={`${clsx(slim ? "sr-only" : 'relative')}`}>
                    {item.name}
                    {item.coming ? (
                      <div className="absolute -right-10 -top-2 z-10 flex h-3 w-8 tracking-normal	 items-center justify-center rounded-[30px] bg-primary font-roboto text-[10px] font-bold text-black">
                        Soon
                      </div>
                    ) : (
                      ""
                    )}
                  </span>
                </motion.a>
              </Link>
            ))}
          </div>
          <div className={clsx(slim ? "items-center p-2" : "px-5", "flex flex-col justify-end")}>
            {navigationExtraData.map((item) => (
              <a
                className="mb-2 flex items-center gap-2 text-sm"
                href={item.href}
                target={"_blank"}
                rel={"noreferrer"}
                key={item.name}
              >
                <div>
                  <DynamicHeroIcon icon={item.icon} className="h-5 w-5  flex-shrink-0 text-gray-400" />
                </div>
                <span className={clsx(slim && "sr-only")}>
                  Visit&nbsp;
                  <span className="dark:text-primary">{item.name}</span>
                </span>
              </a>
            ))}
          </div>
        </nav>
      </div>

      {/* {!slim && <ThemeSwitcher />} */}
      {!slim && <ConnectWallet />}
    </div>
  );
};

export default Navigation;
