/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  productionBrowserSourceMaps: true,
  i18n: {
    locales: ['en'],
    defaultLocale: 'en',
  },
  images: {
    domains: [
      'media.giphy.com',
      'no-nonsense-nft-game-nickytonline.vercel.app',
    ],
  },
};
