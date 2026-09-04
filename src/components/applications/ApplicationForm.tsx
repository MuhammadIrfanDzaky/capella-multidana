"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";

import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { SECTION_HEADING_CLASS } from "@/components/ui/typography";
import {
  APPLICATION_TYPES,
  APPLICATION_TYPE_LABELS,
  tenorOptionsFor,
} from "@/lib/constants";
import {
  applicationFormSchema,
  type ApplicationFormField,
  type ApplicationFormInput,
} from "@/lib/validations/application";
import { createApplication } from "@/server/actions/applications";

import { nikHintFor } from "./nikHint";
import { useNikLookup } from "./useNikLookup";

type SubmitFeedback =
  { ok: true; applicationId: number } | { ok: false; message: string };

/** Cukup lama untuk terbaca tanpa terburu-buru, cukup singkat untuk tidak menghalangi. */
const SUCCESS_DISMISS_MS = 6000;

export function ApplicationForm() {
  const [feedback, setFeedback] = useState<SubmitFeedback | null>(null);

  const {
    control,
    register,
    handleSubmit,
    reset,
    setError,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ApplicationFormInput>({
    // `raw: true` membuat resolver mengembalikan nilai form apa adanya, sehingga
    // yang dikirim ke server adalah masukan mentah. Pengubahan teks menjadi
    // angka tetap dilakukan server saat memvalidasi ulang.
    resolver: zodResolver(applicationFormSchema, undefined, { raw: true }),
    defaultValues: {
      nik: "",
      fullName: "",
      amount: "",
      tenorMonths: "",
      monthlyIncome: "",
      notes: "",
    },
  });

  // `useWatch`, bukan `watch()`: `watch` mengembalikan fungsi baru tiap render
  // sehingga React Compiler melewatkan memoisasi komponen ini.
  const selectedType = useWatch({ control, name: "type" });
  const hasSelectedType = APPLICATION_TYPES.includes(selectedType);
  const tenorOptions = hasSelectedType ? tenorOptionsFor(selectedType) : [];

  // Batas jumlah pengajuan hanya diketahui server. Menanyakannya sejak NIK
  // selesai diketik menghemat pengisian lima kolom berikutnya bila nasabahnya
  // memang sudah tidak dapat mengajukan lagi.
  const nik = useWatch({ control, name: "nik" });
  const nikLookup = useNikLookup(nik);
  const nikHint = nikHintFor(nikLookup);

  // Nasabah yang sudah terdaftar tidak boleh berganti nama lewat form pengajuan.
  // Namanya diambil dari basis data dan dikunci, sehingga NIK yang salah ketik
  // justru terlihat: nama pemilik NIK muncul di kolomnya sendiri, bukan sebagai
  // keterangan kecil yang mudah terlewat.
  const registeredName = nikLookup?.registered ? nikLookup.fullName : null;

  useEffect(() => {
    // Divalidasi hanya ketika terisi, agar galat yang tertinggal ikut hilang.
    // Saat dikosongkan tidak divalidasi: pengguna belum melakukan kesalahan apa pun.
    setValue("fullName", registeredName ?? "", {
      shouldValidate: Boolean(registeredName),
    });
  }, [registeredName, setValue]);

  // Hanya kabar baik yang menghilang sendiri. Kegagalan perlu diakui pengguna,
  // bukan sekadar lewat tanpa sempat terbaca.
  useEffect(() => {
    if (!feedback?.ok) {
      return;
    }

    const timer = setTimeout(() => setFeedback(null), SUCCESS_DISMISS_MS);

    return () => clearTimeout(timer);
  }, [feedback]);

  async function onSubmit(values: ApplicationFormInput) {
    setFeedback(null);

    let result: Awaited<ReturnType<typeof createApplication>>;

    try {
      result = await createApplication(values);
    } catch {
      // Kegagalan di luar dugaan, misalnya sambungan terputus saat aksi dikirim.
      // Tanpa penanganan ini, kegagalannya hanya muncul di konsol peramban dan
      // pengguna melihat form yang seolah tidak bereaksi.
      setFeedback({
        ok: false,
        message: "Periksa sambungan lalu coba lagi.",
      });
      return;
    }

    if (!result.ok) {
      // Galat dari server ditampilkan pada field yang sama seperti galat dari
      // peramban, sehingga pengguna tidak perlu tahu pemeriksaan itu berasal
      // dari mana.
      for (const [field, message] of Object.entries(result.fieldErrors ?? {})) {
        setError(field as ApplicationFormField, { message });
      }

      setFeedback({ ok: false, message: result.message });
      return;
    }

    reset();
    setFeedback({ ok: true, applicationId: result.applicationId });
  }

  // Ketika validasi di peramban menggagalkan pengiriman, `onSubmit` tidak pernah
  // dijalankan. Tanpa penanganan ini, banner dari percobaan sebelumnya tertinggal
  // di layar dan terbaca seolah masih berlaku.
  function onInvalid() {
    setFeedback(null);
  }

  return (
    <>
      {/* Mengambang di luar form, sehingga tetap terlihat walau halaman sedang
          tergulir dan tidak menggeser kolom mana pun saat muncul. Pada layar
          sempit ia menempel di atas: tepi bawah sudah dipakai navigasi. */}
      {feedback ? (
        <div
          role={feedback.ok ? "status" : "alert"}
          className="alert-enter fixed inset-x-4 top-4 z-40 md:inset-x-auto md:top-auto md:right-6 md:bottom-6 md:w-96"
        >
          {feedback.ok ? (
            <Alert
              tone="success"
              title="Pengajuan tersimpan"
              onDismiss={() => setFeedback(null)}
            >
              Pengajuan #{feedback.applicationId} sudah masuk ke daftar.{" "}
              <Link
                href={`/applications/${feedback.applicationId}`}
                className="font-medium underline underline-offset-2"
              >
                Lihat detail
              </Link>
            </Alert>
          ) : (
            <Alert
              tone="danger"
              title="Pengajuan gagal disimpan"
              onDismiss={() => setFeedback(null)}
            >
              {feedback.message}
            </Alert>
          )}
        </div>
      ) : null}

      <form
        onSubmit={handleSubmit(onSubmit, onInvalid)}
        className="space-y-6"
        noValidate
      >
        {/* Dua kolom pada layar lebar agar form lebih ringkas; menumpuk jadi satu
            kolom pada layar sempit. */}
        <fieldset disabled={isSubmitting}>
          <legend className={SECTION_HEADING_CLASS}>Data Nasabah</legend>

          <div className="grid gap-x-5 gap-y-4 sm:grid-cols-2">
            <Input
              label="NIK"
              inputMode="numeric"
              autoComplete="off"
              format="digits"
              maxLength={16}
              hint={nikHint?.text}
              hintTone={nikHint?.tone}
              error={errors.nik?.message}
              {...register("nik")}
            />

            <Input
              label="Nama Lengkap Nasabah"
              autoComplete="off"
              readOnly={Boolean(registeredName)}
              hint={
                registeredName
                  ? "Terisi dari data nasabah yang sudah terdaftar."
                  : undefined
              }
              error={errors.fullName?.message}
              {...register("fullName")}
            />
          </div>
        </fieldset>

        <fieldset disabled={isSubmitting}>
          <legend className={SECTION_HEADING_CLASS}>Data Pengajuan</legend>

          <div className="grid gap-x-5 gap-y-4 sm:grid-cols-2">
            {/* Tenor sengaja bersebelahan dengan tipe, karena pilihannya memang
              ditentukan oleh tipe yang dipilih. */}
            <Select
              label="Tipe Pengajuan"
              defaultValue=""
              error={errors.type?.message}
              {...register("type", {
                // Tanpa ini, tenor milik tipe sebelumnya tetap terpilih setelah
                // pengguna berpindah tipe.
                onChange: () => setValue("tenorMonths", ""),
              })}
            >
              <option value="" disabled>
                Pilih tipe pengajuan
              </option>
              {APPLICATION_TYPES.map((type) => (
                <option key={type} value={type}>
                  {APPLICATION_TYPE_LABELS[type]}
                </option>
              ))}
            </Select>

            <Select
              label="Tenor"
              defaultValue=""
              disabled={!hasSelectedType}
              error={errors.tenorMonths?.message}
              {...register("tenorMonths")}
            >
              <option value="" disabled>
                {hasSelectedType
                  ? "Pilih tenor"
                  : "Pilih tipe pengajuan dahulu"}
              </option>
              {tenorOptions.map((tenor) => (
                <option key={tenor} value={tenor}>
                  {tenor} bulan
                </option>
              ))}
            </Select>

            <Input
              label="Nominal Pengajuan"
              inputMode="numeric"
              format="rupiah"
              error={errors.amount?.message}
              {...register("amount")}
            />

            <Input
              label="Pendapatan Bulanan Nasabah"
              inputMode="numeric"
              format="rupiah"
              error={errors.monthlyIncome?.message}
              {...register("monthlyIncome")}
            />

            <div className="sm:col-span-2">
              <Textarea
                label="Catatan (Opsional)"
                rows={2}
                error={errors.notes?.message}
                {...register("notes")}
              />
            </div>
          </div>
        </fieldset>

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto"
          >
            {isSubmitting ? "Menyimpan..." : "Simpan Pengajuan"}
          </Button>
        </div>
      </form>
    </>
  );
}
