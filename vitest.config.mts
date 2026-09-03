import { fileURLToPath } from "node:url";

import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    // Alias `@` tidak dibaca Vitest dari tsconfig, jadi harus disebutkan ulang.
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
