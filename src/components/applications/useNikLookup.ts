"use client";

import { useEffect, useState } from "react";

import { lookupNik, type NikLookup } from "@/server/actions/customers";

/**
 * Cukup lama untuk tidak menembak pada setiap ketukan, cukup pendek untuk terasa
 * langsung ketika digit terakhir selesai diketik.
 */
const DEBOUNCE_MS = 400;

type Entry = { nik: string; result: NikLookup | null };

/**
 * Menanyakan kelayakan sebuah NIK ke server selagi diketik. Hasilnya `null`
 * selama NIK belum lengkap, sehingga pemanggilnya tidak menampilkan apa pun.
 */
export function useNikLookup(nik: string) {
  // Jawaban disimpan bersama NIK yang menghasilkannya. Menyimpan hasilnya saja
  // menuntut effect ini mengosongkannya setiap kali NIK berubah — dan
  // membersihkan state di dalam effect justru memicu render bertingkat.
  const [entry, setEntry] = useState<Entry | null>(null);

  useEffect(() => {
    if (!/^\d{16}$/.test(nik)) {
      return;
    }

    let active = true;

    const timer = setTimeout(async () => {
      try {
        const result = await lookupNik(nik);

        // Jawaban yang sudah usang diabaikan: NIK dapat berubah sebelum
        // permintaan sebelumnya kembali, dan urutan kedatangannya tidak dijamin.
        if (active) {
          setEntry({ nik, result });
        }
      } catch {
        // Petunjuk hanya pelengkap. Kegagalannya tidak boleh mengganggu
        // pengisian form, dan aturannya tetap ditegakkan saat menyimpan.
        if (active) {
          setEntry({ nik, result: null });
        }
      }
    }, DEBOUNCE_MS);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [nik]);

  // Hasil lama tidak pernah bocor ke NIK yang baru, karena kecocokannya diperiksa
  // saat membaca, bukan dibereskan saat menulis.
  return entry?.nik === nik ? entry.result : null;
}
