import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // The repo root is this directory, not the parent — without this, Next picks up
  // an unrelated package-lock.json from the home directory.
  turbopack: { root: __dirname },
};

export default nextConfig;
