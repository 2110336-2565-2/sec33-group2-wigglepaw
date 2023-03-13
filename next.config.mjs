// @ts-check
/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
 * This is especially useful for Docker builds.
 */
!process.env.SKIP_ENV_VALIDATION && (await import("./src/env/server.mjs"));

/** @type {import("next").NextConfig} */
const config = {
  images: {
    remotePatterns: [
      {
        hostname: "*",
      },
    ],
    domains: ["picsum.photos"],
  },
  reactStrictMode: true,
  /* If trying out the experimental appDir, comment the i18n config out
   * @see https://github.com/vercel/next.js/issues/41980 */
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
  typescript: {
    ignoreBuildErrors: !!process.env.SKIP_TYPESCRIPT,
  },
  eslint: {
    ignoreDuringBuilds: !!process.env.SKIP_ESLINT,
  },
  async redirects() {
    return [
      {
        source: "/user/:username",
        destination: "/user/:username/profile",
        permanent: true,
      },
    ];
  },
};
export default config;
