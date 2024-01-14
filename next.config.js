/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      net: false,
      os: false,
    };
    return config;
  },
  //reactStrictMode: false,
};

module.exports = nextConfig;
