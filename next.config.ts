import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Tanpa ini, `next dev` menulis AGENTS.md dan CLAUDE.md ke folder kerja setiap
  // kali dijalankan, sehingga siapa pun yang meng-clone repositori ini mendapat
  // dua berkas tak terlacak yang bukan bagian dari proyek.
  agentRules: false,

  // better-sqlite3 adalah native module, jadi harus dijalankan langsung oleh
  // Node dan tidak boleh ikut di-bundle.
  serverExternalPackages: ["better-sqlite3"],
};

export default nextConfig;
