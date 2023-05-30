// @ts-check
import { BASE_URL } from "config";

/** @type {import('next-seo').DefaultSeoProps} */
export default {
  titleTemplate: "Brewlabs Earn - %s",
  title: "Brewlabs Earn",
  defaultTitle: "Brewlabs Earn",
  description:
    "Stake your tokens on the Brewlabs staking platform to earn passive income, compound or  harvest your rewards and reflections anytime!",
  twitter: {
    handle: "@TeamBrewlabs",
    site: "@TeamBrewlabs",
    cardType: "summary_large_image",
  },
  openGraph: {
    url: BASE_URL,
    type: "website",
    title: "Brewlabs Earn",
    description:
      "Stake your tokens on the Brewlabs staking platform to earn passive income, compound or  harvest your rewards and reflections anytime!",
    images: [
      {
        url: `${BASE_URL}/images/brewlabs-earn-poster.jpg`,
        width: 1200,
        height: 630,
        alt: "Brewlabs Earn",
      },
    ],
    site_name: "Brewlabs Earn",
  },
};
