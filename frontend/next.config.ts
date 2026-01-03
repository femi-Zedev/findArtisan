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
      ...(r2Hostname
        ? [
            {
              protocol: 'https' as const,
              hostname: r2Hostname,
              pathname: '/**',
            },
          ]
        : []),
      // Fallback: Allow all r2.dev subdomains (if no env var is set)
      // Note: This is a workaround since Next.js doesn't support wildcards
      // For production, it's better to use the specific domain from env
      {
        protocol: 'https' as const,
        hostname: 'pub-e251308ffa3948dbaeec64b5d550d1db.r2.dev',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
