/**
 * Penanda merek mengikuti logo CMD Finance: blok hitam dengan inisial berwarna
 * gold. Header sengaja tanpa navigasi karena baru ada satu halaman; tautan
 * ditambahkan ketika daftar pengajuan tersedia.
 */
export function AppHeader() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-16 max-w-5xl items-center gap-3 px-6">
        <span className="flex size-10 items-center justify-center rounded-lg bg-ink text-sm font-bold tracking-tight text-brand-500">
          CM
        </span>
        <div className="leading-tight">
          <p className="font-semibold tracking-tight text-slate-900">
            CMD Finance
          </p>
          <p className="text-sm text-slate-600">Pencatatan Pengajuan Kredit</p>
        </div>
      </div>
    </header>
  );
}
