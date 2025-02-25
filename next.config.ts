/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['i.imgur.com'], // Voeg de domeinen toe waar je afbeeldingen vandaan komen
  },
  typescript: {
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
