/**
 * @type {import('next').NextConfig}
 */

module.exports = {
  reactStrictMode: true,
  images: {
    domains: ["image.tmdb.org"],
  },
  devIndicators: {
    autoPrerender: false,
  },
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      Object.assign(config.resolve.alias, {
        react: "preact/compat",
        "react-dom/test-utils": "preact/test-utils",
        "react-dom": "preact/compat",
      });
    }

    return config;
  },
};
