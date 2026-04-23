import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.resolve = {
      ...config.resolve,
      alias: {
        ...config.resolve?.alias,
      },
    }

    // Ignore critical dependency warnings from ox library
    config.module = {
      ...config.module,
      exprContextCritical: false,
    }

    return config
  },
}

export default nextConfig
