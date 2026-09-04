import { describe, expect, it } from "vitest";

import { isNavLinkActive } from "./navLinks";

describe("isNavLinkActive", () => {
  it("menandai daftar pengajuan pada halamannya sendiri", () => {
    expect(isNavLinkActive("/applications", "/applications")).toBe(true);
    expect(isNavLinkActive("/applications", "/applications/new")).toBe(false);
  });

  it("menandai daftar pengajuan saat halaman detail dibuka", () => {
    expect(isNavLinkActive("/applications/4", "/applications")).toBe(true);
  });

  it("tidak menandai daftar pengajuan pada halaman pengajuan baru", () => {
    expect(isNavLinkActive("/applications/new", "/applications")).toBe(false);
    expect(isNavLinkActive("/applications/new", "/applications/new")).toBe(true);
  });
});
