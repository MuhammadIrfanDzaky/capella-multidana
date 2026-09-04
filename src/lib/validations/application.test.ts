import { describe, expect, it } from "vitest";

import { applicationFormSchema, decisionNoteSchema } from "./application";

const VALID_INPUT = {
  nik: "1271010101900001",
  fullName: "Budi Santoso",
  type: "CAR" as const,
  amount: "50000000",
  tenorMonths: "24",
  monthlyIncome: "9000000",
  notes: "",
};

/** Mengambil pesan galat pertama untuk sebuah field, atau `null` bila lolos. */
function errorFor(input: Record<string, unknown>, field: string) {
  const result = applicationFormSchema.safeParse(input);

  if (result.success) {
    return null;
  }

  return (
    result.error.issues.find((issue) => issue.path[0] === field)?.message ??
    null
  );
}

function parseValid(input: Record<string, unknown>) {
  const result = applicationFormSchema.safeParse(input);

  if (!result.success) {
    throw new Error(
      `Diharapkan lolos, tetapi ditolak: ${result.error.issues[0].message}`,
    );
  }

  return result.data;
}

describe("applicationFormSchema", () => {
  it("menerima masukan yang sah dan mengubah teks menjadi angka", () => {
    const data = parseValid(VALID_INPUT);

    expect(data.amount).toBe(50_000_000);
    expect(data.monthlyIncome).toBe(9_000_000);
    expect(data.tenorMonths).toBe(24);
    expect(data.notes).toBeNull();
  });

  describe("pendapatan bulanan minimum", () => {
    it("menolak pendapatan di bawah satu juta dengan pesan persis dari soal", () => {
      // Pesan ini disalin apa adanya dari soal. Test ini ada supaya kalimatnya
      // tidak diparafrasekan tanpa sengaja di kemudian hari.
      expect(
        errorFor({ ...VALID_INPUT, monthlyIncome: "999000" }, "monthlyIncome"),
      ).toBe("Nasabah belum dapat mengajukan pinjaman");
    });

    it("menerima pendapatan tepat satu juta", () => {
      expect(
        parseValid({ ...VALID_INPUT, monthlyIncome: "1000000" }).monthlyIncome,
      ).toBe(1_000_000);
    });
  });

  describe("batas nominal", () => {
    it("menolak nominal di atas dua ratus juta", () => {
      expect(
        errorFor({ ...VALID_INPUT, amount: "250000000" }, "amount"),
      ).toContain("maksimal");
    });

    it("menerima nominal tepat dua ratus juta", () => {
      expect(parseValid({ ...VALID_INPUT, amount: "200000000" }).amount).toBe(
        200_000_000,
      );
    });

    it("menolak nominal nol", () => {
      expect(errorFor({ ...VALID_INPUT, amount: "0" }, "amount")).toBeTruthy();
    });

    it("menerima nominal yang memuat pemisah ribuan", () => {
      expect(parseValid({ ...VALID_INPUT, amount: "150.000.000" }).amount).toBe(
        150_000_000,
      );
    });
  });

  describe("tenor menurut tipe pengajuan", () => {
    it("menolak tenor yang tidak berlaku untuk tipe yang dipilih", () => {
      // Sembilan bulan sah bagi sepeda motor, tetapi tidak bagi mobil.
      const message = errorFor(
        { ...VALID_INPUT, type: "CAR", tenorMonths: "9" },
        "tenorMonths",
      );

      expect(message).toContain("Mobil");
      expect(message).toContain("kelipatan 6");
    });

    it("menerima tenor yang sama bila tipenya sepeda motor", () => {
      expect(
        parseValid({ ...VALID_INPUT, type: "MOTORCYCLE", tenorMonths: "9" })
          .tenorMonths,
      ).toBe(9);
    });

    it("menolak tenor melebihi dua puluh empat bulan", () => {
      expect(
        errorFor({ ...VALID_INPUT, tenorMonths: "36" }, "tenorMonths"),
      ).toBeTruthy();
    });
  });

  describe("NIK", () => {
    it("menolak NIK yang bukan enam belas digit", () => {
      expect(
        errorFor({ ...VALID_INPUT, nik: "127101010190000" }, "nik"),
      ).toContain("16 digit");
    });

    it("menolak NIK yang memuat huruf", () => {
      expect(
        errorFor({ ...VALID_INPUT, nik: "12710101019000AB" }, "nik"),
      ).toBeTruthy();
    });
  });

  it("menyimpan catatan kosong sebagai nilai kosong, bukan teks kosong", () => {
    expect(parseValid({ ...VALID_INPUT, notes: "   " }).notes).toBeNull();
  });
});

describe("decisionNoteSchema", () => {
  it("menyimpan alasan yang kosong sebagai nilai kosong", () => {
    expect(decisionNoteSchema.parse("")).toBeNull();
    expect(decisionNoteSchema.parse("   ")).toBeNull();
  });

  it("membuang spasi di ujung alasan", () => {
    expect(decisionNoteSchema.parse("  Pendapatan tidak sebanding.  ")).toBe(
      "Pendapatan tidak sebanding.",
    );
  });

  it("menerima alasan tepat lima ratus karakter", () => {
    expect(decisionNoteSchema.parse("a".repeat(500))).toHaveLength(500);
  });

  it("menolak alasan melebihi lima ratus karakter", () => {
    const result = decisionNoteSchema.safeParse("a".repeat(501));

    expect(result.success).toBe(false);
  });
});
