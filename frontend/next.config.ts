import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname, '..'),
  },
  async rewrites() {
    const backend = 'http://localhost:3001';
    return [
      { source: '/api/ai/:path*',        destination: `${backend}/api/ai/:path*` },
      { source: '/api/commerces/:path*', destination: `${backend}/api/commerces/:path*` },
      { source: '/api/commerces',        destination: `${backend}/api/commerces` },
      { source: '/api/categories',       destination: `${backend}/api/categories` },
      { source: '/api/avis/:path*',      destination: `${backend}/api/avis/:path*` },
      { source: '/api/avis',             destination: `${backend}/api/avis` },
      { source: '/api/auth/:path*',      destination: `${backend}/api/auth/:path*` },
      { source: '/api/recherche',        destination: `${backend}/api/recherche` },
    ];
  },
};

export default nextConfig;
