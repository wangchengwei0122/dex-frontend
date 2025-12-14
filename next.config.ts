import path from "path"
import type { NextConfig } from "next"

const emptyModulePath = path.join(__dirname, "config/empty.js")
const emptyModuleAlias = "./config/empty.js"

const nextConfig: NextConfig = {
  turbopack: {
    resolveAlias: {
      pino: "pino/browser",
      "thread-stream": emptyModuleAlias,
      "pino-pretty": emptyModuleAlias,
      "sonic-boom": emptyModuleAlias,
      "@react-native-async-storage/async-storage": emptyModuleAlias,
    },
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      pino: "pino/browser",
      "thread-stream": emptyModulePath,
      "pino-pretty": emptyModulePath,
      "sonic-boom": emptyModulePath,
      "@react-native-async-storage/async-storage": emptyModulePath,
    }
    return config
  },
}

export default nextConfig
