import { describe, expect, it } from "vitest";

import { calculateInstallment } from "./calculations";

describe("calculateInstallment", () => {
  it("menghitung bunga flat untuk sepeda motor", () => {
    const result = calculateInstallment({
      type: "MOTORCYCLE",
      amount: 25_000_000,
      tenorMonths: 24,
    });

    // 25.000.000 x 24% x 2 tahun
    expect(result.totalInterest).toBe(12_000_000);
    expect(result.totalPayment).toBe(37_000_000);
    expect(result.monthlyInstallment).toBe(1_541_667);
  });

  it("memakai suku bunga yang berbeda menurut tipe pengajuan", () => {
    const base = { amount: 100_000_000, tenorMonths: 12 } as const;

    const motorcycle = calculateInstallment({ ...base, type: "MOTORCYCLE" });
    const car = calculateInstallment({ ...base, type: "CAR" });
    const multipurpose = calculateInstallment({
      ...base,
      type: "MULTIPURPOSE",
    });

    // Mobil paling murah, multiguna paling mahal karena tanpa agunan kendaraan.
    expect(car.totalInterest).toBeLessThan(motorcycle.totalInterest);
    expect(motorcycle.totalInterest).toBeLessThan(multipurpose.totalInterest);
  });

  it("membulatkan angsuran ke rupiah penuh", () => {
    const result = calculateInstallment({
      type: "MULTIPURPOSE",
      amount: 50_000_000,
      tenorMonths: 18,
    });

    expect(result.monthlyInstallment).toBe(4_027_778);
    expect(Number.isInteger(result.monthlyInstallment)).toBe(true);
  });

  it("menyisakan selisih pembulatan pada total pembayaran", () => {
    const result = calculateInstallment({
      type: "MULTIPURPOSE",
      amount: 50_000_000,
      tenorMonths: 18,
    });

    // Perilaku yang disengaja dan dicatat di README: angsuran dibulatkan ke
    // rupiah penuh, sehingga hasil kalinya tidak persis sama dengan total.
    // Pada sistem sesungguhnya selisih ini dibebankan ke angsuran terakhir.
    const difference = result.monthlyInstallment * 18 - result.totalPayment;

    expect(difference).not.toBe(0);
    expect(Math.abs(difference)).toBeLessThan(18);
  });

  it("menolak tenor nol agar tidak menghasilkan Infinity", () => {
    expect(() =>
      calculateInstallment({
        type: "CAR",
        amount: 10_000_000,
        tenorMonths: 0,
      }),
    ).toThrow();
  });
});
