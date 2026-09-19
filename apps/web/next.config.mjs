import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  compiler: {
    removeConsole: process.env.NODE_ENV === "production" ? { exclude: ["error"] } : false,
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "@santrios/ui"],
  },
  transpilePackages: [
    "@santrios/ui",
    "@santrios/database",
    "@santrios/auth",
    "@santrios/modules",
    "@santrios/types",
    "@santrios/utils",
    "@santrios/validators",
  ],
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@santrios/ui": path.resolve(__dirname, "../../packages/ui/src"),
      "@santrios/database": path.resolve(__dirname, "../../packages/database/src"),
      "@santrios/auth": path.resolve(__dirname, "../../packages/auth/src"),
      "@santrios/modules": path.resolve(__dirname, "../../packages/modules/src"),
      "@santrios/types": path.resolve(__dirname, "../../packages/types/src"),
      "@santrios/utils": path.resolve(__dirname, "../../packages/utils/src"),
      "@santrios/validators": path.resolve(__dirname, "../../packages/validators/src"),
    };
    return config;
  },
};

export default nextConfig;
