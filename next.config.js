/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "links.papareact.com",
      "cloud.appwrite.io",
      "tecdn.b-cdn.net",
      "www.flaticon.com",
    ],
  },
  reactStrictMode: false, // turn to false
};

module.exports = nextConfig;
