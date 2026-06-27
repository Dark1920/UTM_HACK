import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname, '..'),
  },
  async rewrites() {
    return [
      {
        source: '/api/ai/:path*',
        destination: 'http://localhost:3001/api/ai/:path*',
      },
    ];
  },
};

export default nextConfig;
