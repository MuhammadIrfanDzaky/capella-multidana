import { AppNav } from "./AppNav";

export function AppHeader() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-1 px-6 py-3 sm:h-16 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:py-0">
        <div className="flex items-center gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-ink text-sm font-bold tracking-tight text-brand-500">
            CM
          </span>
          <div className="leading-tight">
            <p className="font-semibold tracking-tight text-slate-900">
              CMD Finance
            </p>
            <p className="hidden text-sm text-slate-600 sm:block">
              Pencatatan Pengajuan Kredit
            </p>
          </div>
        </div>

        <AppNav />
      </div>
    </header>
  );
}
