/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["img.youtube.com"],
  },
  async redirects() {
    return [
      {
        source: "/pools",
        destination: "/staking",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
