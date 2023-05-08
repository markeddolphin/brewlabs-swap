import { memoize } from "lodash";
import { PageMeta } from "./types";

export const DEFAULT_META: PageMeta = {
  title: "Brewlabs Earn",
  description:
    "Stake your tokens on the Brewlabs staking platform to earn passive income, compound or  harvest your rewards and reflections anytime!",
  image: "https://bridge.brewlabs.info/images/brewlabs-earn-poster.jpg",
};

interface PathList {
  paths: {
    [path: string]: { title: string; basePath?: boolean; description?: string };
  };
  defaultTitleSuffix: string;
}
const getPathList = (): PathList => {
  return {
    paths: {
      "/": { title: "Home" },
      "/swap": { basePath: true, title: "Swap Aggregator" },
      "/add": { basePath: true, title: "Add Liquidity" },
      "/remove": { basePath: true, title: "Remove Liquidity" },
      "/liquidity": { title: "Liquidity" },
      "/find": { title: "Import Pool" },
      "/farms": { title: "Farms" },
      "/indexes": { title: "Stable Indexes" },
      "/staking": { title: "Staking pools" },
      "/bridge": { title: "Bridge", description: "Transfer tokens cross-chain with the Brewlabs bridge." },
      "/constructor": { title: "Constructor" },
    },
    defaultTitleSuffix: "Brewlabs Earn",
  };
};

export const getCustomMeta = memoize(
  (path: string): PageMeta => {
    const pathList = getPathList();

    const pathMetadata =
      pathList.paths[path] ??
      pathList.paths[
        Object.entries(pathList.paths).find(([url, data]) => data.basePath && path.startsWith(url))?.[0] ?? "/"
      ];

    if (pathMetadata) {
      return {
        title: `${pathList.defaultTitleSuffix} - ${pathMetadata.title}`,
        ...(pathMetadata.description && {
          description: pathMetadata.description,
        }),
      };
    }
    return { title: pathList.defaultTitleSuffix };
  },
  (path) => `${path}`
);
