import Image from "next/image";

import { AppNav } from "./AppNav";

export function AppHeader() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-6">
        {/* Ukuran asli dipertahankan agar Next mengetahui rasionya dan tidak ada
            pergeseran tata letak saat gambar selesai dimuat. `priority` dipakai
            karena logo tampil di setiap halaman dan selalu berada di layar. */}
        <Image
          src="/logo-cmd.png"
          alt="CMD Finance"
          width={331}
          height={216}
          priority
          className="h-9 w-auto"
        />

        <AppNav />
      </div>
    </header>
  );
}
