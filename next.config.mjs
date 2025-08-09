/** @type {import('next').NextConfig} */
const nextConfig = {
  // Reduce bundle size
  experimental: {
    optimizePackageImports: ["react-hook-form", "axios"], // Tree-shake these packages
  },

  // Optimize compilation
  typescript: {
    // Skip type checking during build (can be done separately)
    ignoreBuildErrors: false,
  },

  eslint: {
    // Skip ESLint during build if it's slow
    ignoreDuringBuilds: false,
  },

  // Image optimization
  images: {
    formats: ["image/webp", "image/avif"],
  },

  // Webpack optimizations
  webpack: (config, { dev, isServer }) => {
    if (dev) {
      // Development optimizations
      config.optimization.removeAvailableModules = false;
      config.optimization.removeEmptyChunks = false;
      config.optimization.splitChunks = false;
    }

    // Reduce memory usage
    config.optimization.moduleIds = "deterministic";

    return config;
  },
};

export default nextConfig;
