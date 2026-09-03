import { describe, expect, it } from "vitest";

import { applicationFormSchema } from "./application";

const MASUKAN_SAH = {
  nik: "1271010101900001",
  fullName: "Budi Santoso",
  type: "CAR" as const,
  amount: "50000000",
  tenorMonths: "24",
  monthlyIncome: "9000000",
  notes: "",
};

/** Mengambil pesan galat pertama untuk sebuah field, atau `null` bila lolos. */
function galat(masukan: Record<string, unknown>, field: string) {
  const hasil = applicationFormSchema.safeParse(masukan);

  if (hasil.success) {
    return null;
  }

  return (
    hasil.error.issues.find((issue) => issue.path[0] === field)?.message ?? null
  );
}

function lolos(masukan: Record<string, unknown>) {
  const hasil = applicationFormSchema.safeParse(masukan);

  if (!hasil.success) {
    throw new Error(
      `Diharapkan lolos, tetapi ditolak: ${hasil.error.issues[0].message}`,
    );
  }

  return hasil.data;
}

describe("applicationFormSchema", () => {
  it("menerima masukan yang sah dan mengubah teks menjadi angka", () => {
    const data = lolos(MASUKAN_SAH);

    expect(data.amount).toBe(50_000_000);
    expect(data.monthlyIncome).toBe(9_000_000);
    expect(data.tenorMonths).toBe(24);
    expect(data.notes).toBeNull();
  });

  describe("pendapatan bulanan minimum", () => {
    it("menolak pendapatan di bawah satu juta dengan pesan persis dari soal", () => {
      // Pesan ini disalin apa adanya dari soal. Test ini ada supaya kalimatnya
      // tidak diparafrasekan tanpa sengaja di kemudian hari.
      expect(galat({ ...MASUKAN_SAH, monthlyIncome: "999000" }, "monthlyIncome")).toBe(
        "Nasabah belum dapat mengajukan pinjaman",
      );
    });

    it("menerima pendapatan tepat satu juta", () => {
      expect(lolos({ ...MASUKAN_SAH, monthlyIncome: "1000000" }).monthlyIncome).toBe(
        1_000_000,
      );
    });
  });

  describe("batas nominal", () => {
    it("menolak nominal di atas dua ratus juta", () => {
      expect(galat({ ...MASUKAN_SAH, amount: "250000000" }, "amount")).toContain(
        "maksimal",
      );
    });

    it("menerima nominal tepat dua ratus juta", () => {
      expect(lolos({ ...MASUKAN_SAH, amount: "200000000" }).amount).toBe(
        200_000_000,
      );
    });

    it("menolak nominal nol", () => {
      expect(galat({ ...MASUKAN_SAH, amount: "0" }, "amount")).toBeTruthy();
    });

    it("menerima nominal yang memuat pemisah ribuan", () => {
      expect(lolos({ ...MASUKAN_SAH, amount: "150.000.000" }).amount).toBe(
        150_000_000,
      );
    });
  });

  describe("tenor menurut tipe pengajuan", () => {
    it("menolak tenor yang tidak berlaku untuk tipe yang dipilih", () => {
      // Sembilan bulan sah bagi sepeda motor, tetapi tidak bagi mobil.
      const pesan = galat(
        { ...MASUKAN_SAH, type: "CAR", tenorMonths: "9" },
        "tenorMonths",
      );

      expect(pesan).toContain("Mobil");
      expect(pesan).toContain("kelipatan 6");
    });

    it("menerima tenor yang sama bila tipenya sepeda motor", () => {
      expect(
        lolos({ ...MASUKAN_SAH, type: "MOTORCYCLE", tenorMonths: "9" })
          .tenorMonths,
      ).toBe(9);
    });

    it("menolak tenor melebihi dua puluh empat bulan", () => {
      expect(
        galat({ ...MASUKAN_SAH, tenorMonths: "36" }, "tenorMonths"),
      ).toBeTruthy();
    });
  });

  describe("NIK", () => {
    it("menolak NIK yang bukan enam belas digit", () => {
      expect(galat({ ...MASUKAN_SAH, nik: "127101010190000" }, "nik")).toContain(
        "16 digit",
      );
    });

    it("menolak NIK yang memuat huruf", () => {
      expect(galat({ ...MASUKAN_SAH, nik: "12710101019000AB" }, "nik")).toBeTruthy();
    });
  });

  it("menyimpan catatan kosong sebagai nilai kosong, bukan teks kosong", () => {
    expect(lolos({ ...MASUKAN_SAH, notes: "   " }).notes).toBeNull();
  });
});
