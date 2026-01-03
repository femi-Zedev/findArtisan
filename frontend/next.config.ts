import type { NextConfig } from "next";

// Extract hostname from R2 public URL if provided
const getR2Hostname = () => {
  const publicUrl = process.env.NEXT_PUBLIC_CF_PUBLIC_ACCESS_URL || process.env.CF_PUBLIC_ACCESS_URL;
  if (publicUrl) {
    try {
      const url = new URL(publicUrl);
      return url.hostname;
    } catch {
      // If URL parsing fails, try to extract hostname manually
      return publicUrl.replace(/^https?:\/\//, '').split('/')[0];
    }
  }
  return null;
};

const r2Hostname = getR2Hostname();

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Cloudflare R2 public domain (from environment variable)
      // NOTE: For production, ensure NEXT_PUBLIC_CF_PUBLIC_ACCESS_URL is set
      // The fallback hardcoded domain has been removed for production safety
      ...(r2Hostname
        ? [
            {
              protocol: 'https' as const,
              hostname: r2Hostname,
              pathname: '/**',
            },
          ]
        : []),
    ],
  },
};

export default nextConfig;
