"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";

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

type SubmitFeedback = { ok: boolean; message: string };

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

  // Tenor yang tersedia bergantung pada tipe pengajuan, sehingga kolom tenor
  // baru dapat diisi setelah tipe dipilih.
  //
  // `useWatch` dipakai, bukan `watch()`, karena `watch` mengembalikan fungsi baru
  // pada setiap render sehingga React Compiler melewatkan memoisasi komponen ini.
  const selectedType = useWatch({ control, name: "type" });
  const hasSelectedType = APPLICATION_TYPES.includes(selectedType);
  const tenorOptions = hasSelectedType ? tenorOptionsFor(selectedType) : [];

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
        message: "Pengajuan gagal dikirim. Periksa sambungan lalu coba lagi.",
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
    setFeedback({
      ok: true,
      message: `Pengajuan #${result.applicationId} berhasil disimpan.`,
    });
  }

  // Ketika validasi di peramban menggagalkan pengiriman, `onSubmit` tidak pernah
  // dijalankan. Tanpa penanganan ini, banner dari percobaan sebelumnya tertinggal
  // di layar dan terbaca seolah masih berlaku.
  function onInvalid() {
    setFeedback(null);
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit, onInvalid)}
      className="space-y-8"
      noValidate
    >
      {feedback ? (
        <p
          role="status"
          className={`rounded-lg border px-4 py-3 font-medium ${
            feedback.ok
              ? "border-emerald-300 bg-emerald-50 text-emerald-900"
              : "border-red-300 bg-red-50 text-red-900"
          }`}
        >
          {feedback.message}
        </p>
      ) : null}

      <fieldset disabled={isSubmitting}>
        <legend className={SECTION_HEADING_CLASS}>Data Nasabah</legend>

        <div className="space-y-5">
          <Input
            label="NIK"
            hint="Nomor Induk Kependudukan sesuai KTP nasabah."
            inputMode="numeric"
            autoComplete="off"
            numericOnly
            maxLength={16}
            error={errors.nik?.message}
            {...register("nik")}
          />

          <Input
            label="Nama Lengkap Nasabah"
            autoComplete="off"
            error={errors.fullName?.message}
            {...register("fullName")}
          />
        </div>
      </fieldset>

      <fieldset disabled={isSubmitting}>
        <legend className={SECTION_HEADING_CLASS}>Data Pengajuan</legend>

        <div className="space-y-5">
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

          <div className="grid gap-5 sm:grid-cols-2">
            <Input
              label="Nominal Pengajuan"
              hint="Dalam rupiah, tanpa titik atau koma."
              inputMode="numeric"
              numericOnly
              error={errors.amount?.message}
              {...register("amount")}
            />

            <Select
              label="Tenor"
              defaultValue=""
              disabled={!hasSelectedType}
              hint={
                hasSelectedType
                  ? undefined
                  : "Pilih tipe pengajuan terlebih dahulu."
              }
              error={errors.tenorMonths?.message}
              {...register("tenorMonths")}
            >
              <option value="" disabled>
                Pilih tenor
              </option>
              {tenorOptions.map((tenor) => (
                <option key={tenor} value={tenor}>
                  {tenor} bulan
                </option>
              ))}
            </Select>
          </div>

          <Input
            label="Pendapatan Bulanan Nasabah"
            hint="Dalam rupiah, tanpa titik atau koma."
            inputMode="numeric"
            numericOnly
            error={errors.monthlyIncome?.message}
            {...register("monthlyIncome")}
          />

          <Textarea
            label="Catatan"
            rows={3}
            hint="Opsional."
            error={errors.notes?.message}
            {...register("notes")}
          />
        </div>
      </fieldset>

      <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
        {isSubmitting ? "Menyimpan..." : "Simpan Pengajuan"}
      </Button>
    </form>
  );
}
