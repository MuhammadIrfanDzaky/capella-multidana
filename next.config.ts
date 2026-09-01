import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // better-sqlite3 adalah native module, jadi harus dijalankan langsung oleh
  // Node dan tidak boleh ikut di-bundle.
  serverExternalPackages: ["better-sqlite3"],
};

export default nextConfig;
