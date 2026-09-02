"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import {
  APPLICATION_TYPES,
  APPLICATION_TYPE_LABELS,
  TENOR_OPTIONS,
} from "@/lib/constants";
import {
  applicationFormSchema,
  type ApplicationFormInput,
} from "@/lib/validations/application";
import { createApplication } from "@/server/actions/applications";

type SubmitFeedback = { ok: boolean; message: string };

export function ApplicationForm() {
  const [feedback, setFeedback] = useState<SubmitFeedback | null>(null);

  const {
    register,
    handleSubmit,
    reset,
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

  async function onSubmit(values: ApplicationFormInput) {
    setFeedback(null);

    const result = await createApplication(values);

    if (!result.ok) {
      setFeedback({ ok: false, message: result.message });
      return;
    }

    reset();
    setFeedback({
      ok: true,
      message: `Pengajuan #${result.applicationId} berhasil disimpan.`,
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      {feedback ? (
        <p
          role="status"
          className={`rounded-md border px-3 py-2 text-sm ${
            feedback.ok
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border-red-200 bg-red-50 text-red-800"
          }`}
        >
          {feedback.message}
        </p>
      ) : null}

      <Input
        label="NIK"
        hint="Nomor Induk Kependudukan sesuai KTP nasabah."
        inputMode="numeric"
        autoComplete="off"
        error={errors.nik?.message}
        {...register("nik")}
      />

      <Input
        label="Nama Lengkap Nasabah"
        autoComplete="off"
        error={errors.fullName?.message}
        {...register("fullName")}
      />

      <Select
        label="Tipe Pengajuan"
        defaultValue=""
        error={errors.type?.message}
        {...register("type")}
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

      <Input
        label="Nominal Pengajuan"
        hint="Dalam rupiah, tanpa titik atau koma."
        inputMode="numeric"
        error={errors.amount?.message}
        {...register("amount")}
      />

      <Select
        label="Tenor"
        defaultValue=""
        error={errors.tenorMonths?.message}
        {...register("tenorMonths")}
      >
        <option value="" disabled>
          Pilih tenor
        </option>
        {TENOR_OPTIONS.map((tenor) => (
          <option key={tenor} value={tenor}>
            {tenor} bulan
          </option>
        ))}
      </Select>

      <Input
        label="Pendapatan Bulanan Nasabah"
        hint="Dalam rupiah, tanpa titik atau koma."
        inputMode="numeric"
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

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Menyimpan..." : "Simpan Pengajuan"}
      </Button>
    </form>
  );
}
