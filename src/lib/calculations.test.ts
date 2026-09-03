import { describe, expect, it } from "vitest";

import { calculateInstallment } from "./calculations";

describe("calculateInstallment", () => {
  it("menghitung bunga flat untuk sepeda motor", () => {
    const hasil = calculateInstallment({
      type: "MOTORCYCLE",
      amount: 25_000_000,
      tenorMonths: 24,
    });

    // 25.000.000 x 24% x 2 tahun
    expect(hasil.totalInterest).toBe(12_000_000);
    expect(hasil.totalPayment).toBe(37_000_000);
    expect(hasil.monthlyInstallment).toBe(1_541_667);
  });

  it("memakai suku bunga yang berbeda menurut tipe pengajuan", () => {
    const masukan = { amount: 100_000_000, tenorMonths: 12 } as const;

    const motor = calculateInstallment({ ...masukan, type: "MOTORCYCLE" });
    const mobil = calculateInstallment({ ...masukan, type: "CAR" });
    const multiguna = calculateInstallment({ ...masukan, type: "MULTIPURPOSE" });

    // Mobil paling murah, multiguna paling mahal karena tanpa agunan kendaraan.
    expect(mobil.totalInterest).toBeLessThan(motor.totalInterest);
    expect(motor.totalInterest).toBeLessThan(multiguna.totalInterest);
  });

  it("membulatkan angsuran ke rupiah penuh", () => {
    const hasil = calculateInstallment({
      type: "MULTIPURPOSE",
      amount: 50_000_000,
      tenorMonths: 18,
    });

    expect(hasil.monthlyInstallment).toBe(4_027_778);
    expect(Number.isInteger(hasil.monthlyInstallment)).toBe(true);
  });

  it("menyisakan selisih pembulatan pada total pembayaran", () => {
    const hasil = calculateInstallment({
      type: "MULTIPURPOSE",
      amount: 50_000_000,
      tenorMonths: 18,
    });

    // Perilaku yang disengaja dan dicatat di README: angsuran dibulatkan ke
    // rupiah penuh, sehingga hasil kalinya tidak persis sama dengan total.
    // Pada sistem sesungguhnya selisih ini dibebankan ke angsuran terakhir.
    const selisih =
      hasil.monthlyInstallment * 18 - hasil.totalPayment;

    expect(selisih).not.toBe(0);
    expect(Math.abs(selisih)).toBeLessThan(18);
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
