/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        remotePatterns: [
            {
                protocol: "http",
                hostname: "localhost",
            },
        ],
    },
    env: {
        MapboxAccessToken: process.env.MapboxAccessToken,
    },
}

module.exports = nextConfig
