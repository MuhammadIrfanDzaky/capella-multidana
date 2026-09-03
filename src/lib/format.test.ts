import { describe, expect, it } from "vitest";

import { formatRupiah, formatThousands } from "./format";

/**
 * `Intl` menyisipkan spasi tak-terpisah setelah "Rp". Spasinya diseragamkan agar
 * pembandingan tidak bergantung pada karakter yang tidak kasatmata.
 */
function normalkanSpasi(value: string) {
  return value.replace(/\s/g, " ");
}

describe("formatRupiah", () => {
  it("memformat sebagai rupiah tanpa angka desimal", () => {
    expect(normalkanSpasi(formatRupiah(25_000_000))).toBe("Rp 25.000.000");
  });

  it("memformat nol", () => {
    expect(normalkanSpasi(formatRupiah(0))).toBe("Rp 0");
  });
});

describe("formatThousands", () => {
  it("menyisipkan titik setiap tiga digit", () => {
    expect(formatThousands("25000000")).toBe("25.000.000");
  });

  it("membiarkan angka pendek apa adanya", () => {
    expect(formatThousands("999")).toBe("999");
  });

  it("membuang nol di depan", () => {
    expect(formatThousands("025000000")).toBe("25.000.000");
  });

  it("mempertahankan nol tunggal", () => {
    expect(formatThousands("0")).toBe("0");
  });

  it("membuang karakter selain angka, termasuk yang ditempel", () => {
    expect(formatThousands("12ab34cd")).toBe("1.234");
  });

  it("menghasilkan teks kosong untuk masukan tanpa angka", () => {
    expect(formatThousands("abc")).toBe("");
  });
});
