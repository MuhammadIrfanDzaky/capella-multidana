import { describe, expect, it } from "vitest";

import {
  APPLICATION_TYPES,
  MAX_APPROVABLE_TENOR_MONTHS,
  TENOR_RULES,
  tenorOptionsFor,
} from "./constants";

describe("tenorOptionsFor", () => {
  it("memberi kelipatan tiga bulan untuk sepeda motor", () => {
    expect(tenorOptionsFor("MOTORCYCLE")).toEqual([
      3, 6, 9, 12, 15, 18, 21, 24,
    ]);
  });

  it("memberi kelipatan enam bulan untuk mobil", () => {
    expect(tenorOptionsFor("CAR")).toEqual([6, 12, 18, 24]);
  });

  it("tidak pernah melewati batas tenor yang dapat disetujui", () => {
    for (const type of APPLICATION_TYPES) {
      const options = tenorOptionsFor(type);

      expect(Math.max(...options)).toBeLessThanOrEqual(
        MAX_APPROVABLE_TENOR_MONTHS,
      );
    }
  });

  it("menghasilkan daftar yang seluruhnya kelipatan aturannya", () => {
    for (const type of APPLICATION_TYPES) {
      const { step } = TENOR_RULES[type];

      for (const tenor of tenorOptionsFor(type)) {
        expect(tenor % step).toBe(0);
      }
    }
  });
});
