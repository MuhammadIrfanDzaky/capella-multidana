/**
 * Ditampilkan selagi daftar pengajuan diambil dari basis data. Kerangkanya
 * meniru tata letak tabel sebenarnya agar isi halaman tidak melompat ketika data
 * selesai dimuat.
 */
export default function ApplicationsLoading() {
  return (
    <div aria-busy="true" aria-live="polite">
      <p className="sr-only">Memuat daftar pengajuan.</p>

      <div className="mb-6 h-9 w-64 animate-pulse rounded-lg bg-slate-200" />

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="h-12 border-b border-slate-200 bg-slate-50" />
        {[0, 1, 2, 3].map((row) => (
          <div
            key={row}
            className="flex items-center gap-4 border-b border-slate-100 px-4 py-4 last:border-b-0"
          >
            <div className="h-4 w-40 animate-pulse rounded bg-slate-200" />
            <div className="h-4 w-28 animate-pulse rounded bg-slate-200" />
            <div className="ml-auto h-4 w-32 animate-pulse rounded bg-slate-200" />
          </div>
        ))}
      </div>
    </div>
  );
}
