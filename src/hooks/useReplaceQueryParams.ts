import { useRouter } from "next/router";

export const useReplaceQueryParams = () => {
  const router = useRouter();

  const replaceQueryParams = (key: string, val: any) => {
    let isLiquidityPage = ["add", "remove"].includes(router.pathname.split("/")[1]);

    router.query[key] = val;
    router.push({
      pathname: isLiquidityPage
        ? [...router.asPath.split("/").slice(0, 2), val, ...router.asPath.split("/").splice(3)].join("/")
        : router.pathname,
      query: isLiquidityPage ? {} : router.query,
    });
  };

  return { replaceQueryParams };
};
