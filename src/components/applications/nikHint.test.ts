import { describe, expect, it } from "vitest";

import { nikHintFor } from "./nikHint";

describe("nikHintFor", () => {
  it("tidak memberi petunjuk selama NIK belum ditelusuri", () => {
    expect(nikHintFor(null)).toBeNull();
  });

  it("memberitahukan bahwa nasabah baru akan dibuat", () => {
    const hint = nikHintFor({ registered: false });

    expect(hint?.text).toContain("Nasabah baru");
    expect(hint?.tone).toBe("neutral");
  });

  it("menyebut jumlah pengajuan tanpa mengulang nama yang sudah terisi", () => {
    const hint = nikHintFor({
      registered: true,
      fullName: "Budi Santoso",
      applicationCount: 2,
      atLimit: false,
    });

    expect(hint?.text).toContain("2 dari 3");
    expect(hint?.text).not.toContain("Budi Santoso");
    expect(hint?.tone).toBe("neutral");
  });

  it("memperingatkan ketika nasabah sudah mencapai batas", () => {
    const hint = nikHintFor({
      registered: true,
      fullName: "Dewi Lestari",
      applicationCount: 3,
      atLimit: true,
    });

    expect(hint?.text).toContain("batas 3 pengajuan");
    expect(hint?.text).not.toContain("Dewi Lestari");
    expect(hint?.tone).toBe("warning");
  });
});
