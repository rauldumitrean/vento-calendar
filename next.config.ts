import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["nodemailer", "bcryptjs"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
    ],
  },
  webpack: (config, { isServer }) => {
    // Fix for EISDIR: readlink on Windows paths with special characters
    config.resolve.symlinks = false;
    return config;
  },
};

export default nextConfig;
