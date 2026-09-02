# CMD Finance — Pencatatan Pengajuan Kredit

Internal tool untuk mencatat pengajuan pembiayaan nasabah, melihat daftar pengajuan, dan
memproses persetujuan. Dipakai oleh tim internal, bukan oleh nasabah.

Dibangun sebagai prototype: cakupannya sengaja dijaga tetap sederhana, dengan penekanan pada
kerapian struktur kode, konsistensi gaya, dan kejelasan dokumentasi.

---

## Teknologi

| Teknologi | Alasan pemilihan |
|---|---|
| **Next.js 16 (App Router)** | Satu kerangka untuk UI sekaligus logika server. Server Component membuat lapisan API terpisah tidak diperlukan pada aplikasi sekecil ini. |
| **TypeScript** | Menangkap salah tipe pada nilai uang dan status sebelum program dijalankan. |
| **Tailwind CSS v4** | Diwajibkan pada soal. Token warna merek didefinisikan lewat `@theme`. |
| **SQLite + Drizzle ORM** | **Nol dependensi eksternal**: tidak perlu memasang PostgreSQL atau Docker untuk menjalankan proyek ini. Skema ditulis sebagai TypeScript, sehingga tipe hasil query mengikuti definisi tabel secara otomatis. |
| **Zod + React Hook Form** | Satu skema validasi dipakai di dua sisi — umpan balik langsung di browser, dan penegakan sebenarnya di server. |

Basis data sengaja **tidak** memakai PostgreSQL. Aplikasi ini harus dapat dijalankan penilai
dalam hitungan menit tanpa menyiapkan layanan apa pun, dan SQLite berbentuk satu berkas biasa.

---

## Prasyarat

- **Node.js 22 LTS** atau lebih baru — versi yang dipakai tercantum pada `.nvmrc`
- npm

Bila memakai `nvm`, cukup jalankan `nvm use` di dalam folder proyek.

> Node.js versi ganjil (23, 25, dan seterusnya) sebaiknya dihindari. Paket `better-sqlite3`
> belum menyediakan binary siap pakai untuk versi tersebut, sehingga npm akan mencoba
> mengompilasinya dari kode sumber dan membutuhkan perkakas kompilasi tambahan.

---

## Menjalankan

```bash
npm install
```

```bash
npm run db:migrate
```

```bash
npm run db:seed
```

```bash
npm run dev
```

Aplikasi berjalan di **http://localhost:3000** dan langsung mengarah ke daftar pengajuan.

`db:migrate` membuat berkas basis data `data/app.db` beserta tabelnya. `db:seed` mengisi data
contoh; langkah ini opsional, tetapi disarankan agar tampilan tidak kosong saat pertama dibuka.
Seed dapat dijalankan ulang kapan saja untuk mengembalikan data ke kondisi awal.

### Perintah yang tersedia

| Perintah | Kegunaan |
|---|---|
| `npm run dev` | Menjalankan server pengembangan |
| `npm run build` | Membangun versi produksi |
| `npm start` | Menjalankan hasil build |
| `npm run lint` | Memeriksa gaya kode |
| `npm run db:generate` | Membuat berkas migrasi baru dari perubahan skema |
| `npm run db:migrate` | Menerapkan migrasi ke basis data |
| `npm run db:seed` | Mengisi ulang data contoh |

---

## Struktur folder

```
drizzle/                        berkas migrasi SQL, ikut disimpan di repositori
data/                           lokasi berkas SQLite (isinya tidak ikut repositori)
src/
  app/
    layout.tsx                  kerangka halaman: header dan container
    page.tsx                    pengalihan ke /applications
    error.tsx                   batas galat untuk seluruh halaman
    not-found.tsx               halaman 404
    applications/
      page.tsx                  daftar pengajuan
      loading.tsx               kerangka tampilan selagi daftar dimuat
      new/page.tsx              form pengajuan baru
      [id]/page.tsx             detail pengajuan
  components/
    layout/                     header dan navigasi aplikasi
    ui/                         primitif tampilan dan token gaya bersama
    applications/               komponen khusus domain pengajuan
  db/
    schema.ts                   definisi tabel
    index.ts                    koneksi basis data
    seed.ts                     data contoh
  lib/
    constants.ts                kosakata domain, label Indonesia, suku bunga
    calculations.ts             perhitungan angsuran
    format.ts                   pemformatan rupiah dan tanggal
    validations/                skema Zod
  server/
    actions/                    Server Action untuk perubahan data
    queries/                    pembacaan data
```

**Konvensi penamaan:** seluruh pengenal, nama berkas, dan alamat halaman memakai bahasa
Inggris; hanya teks yang tampil kepada pengguna memakai bahasa Indonesia. Contohnya alamat
`/applications` dengan judul halaman "Daftar Pengajuan".

**Gaya tampilan** dikumpulkan agar tidak perlahan bergeser antar halaman. Direktori
`components/ui` memuat primitif tampilan (Input, Select, Textarea, Button, Badge, Dialog,
Card, EmptyState) beserta token yang dipakai bersama: kelas kontrol form, kelas judul, dan
tiga lebar isi halaman yang masing-masing diberi nama menurut jenis isinya.

---

## Model data

```
customers
  id, nik (unik), full_name, created_at

applications
  id, customer_id → customers.id, type, amount, tenor_months,
  monthly_income, notes, status, created_at, decided_at
```

Beberapa keputusan yang menopang model ini:

- **Nilai uang disimpan sebagai bilangan bulat rupiah**, bukan bilangan pecahan. Bilangan
  pecahan biner tidak dapat mewakili pecahan desimal secara tepat, dan pada sistem keuangan
  selisih pembulatan menumpuk seiring waktu.
- **Angsuran per bulan tidak disimpan.** Nilainya diturunkan dari nominal, tenor, dan suku
  bunga. Menyimpannya akan menciptakan dua sumber kebenaran yang dapat berbeda.
- **Pendapatan bulanan melekat pada pengajuan, bukan pada nasabah.** Pendapatan berubah
  seiring waktu, sedangkan kelayakan dinilai pada saat pengajuan dibuat, sehingga nilainya
  perlu dibekukan per pengajuan.
- **Foreign key diaktifkan secara eksplisit.** SQLite tidak menegakkan relasi antar tabel
  kecuali `PRAGMA foreign_keys = ON` dijalankan pada setiap koneksi.

---

## Asumsi & Keputusan Desain

Soal menyisakan beberapa hal yang tidak ditentukan. Bagian ini mencatat pilihan yang diambil
beserta alasannya.

### Rumus angsuran

Soal tidak menyebutkan cara menghitung tagihan per bulan. Yang dipakai di sini adalah
**bunga flat**:

```
total bunga = pokok x suku bunga per tahun x (tenor / 12)
angsuran    = (pokok + total bunga) / tenor
```

Bunga flat dipilih karena itulah praktik yang lazim pada pembiayaan kendaraan di Indonesia,
dan menghasilkan cicilan yang tetap setiap bulan — sesuai dengan kolom tunggal "tagihan
nasabah per bulan" yang diminta soal.

Alternatif yang dipertimbangkan adalah **anuitas**. Metode itu lebih tepat secara matematis dan
lazim dipakai pada kredit pemilikan rumah, tetapi menghasilkan angsuran yang komposisi pokok
dan bunganya berubah tiap bulan — kerumitan yang tidak dibutuhkan di sini.

Angsuran dibulatkan ke rupiah penuh. Akibatnya `angsuran x tenor` dapat berselisih beberapa
rupiah dari total pembayaran, misalnya Rp 8 pada tenor 24 bulan. Pada sistem sesungguhnya,
selisih ini dibebankan pada angsuran terakhir.

Halaman detail menampilkan perhitungan ini sebagai rincian bertahap — pokok, suku bunga, total
bunga, total pembayaran, lalu angsuran per bulan — sehingga cara angka tersebut diperoleh dapat
ditelusuri, bukan muncul begitu saja.

### Suku bunga

| Tipe pengajuan | Suku bunga per tahun |
|---|---|
| Sepeda Motor | 24% |
| Mobil | 15% |
| Multiguna | 30% |

**Angka ini ilustratif dan bukan suku bunga resmi CMD Finance.** Besarannya dibedakan per tipe
karena tanpa itu, pilihan tipe pengajuan tidak akan memengaruhi perhitungan apa pun. Kendaraan
roda dua berisiko lebih tinggi daripada roda empat, sedangkan multiguna tidak beragunan
kendaraan sehingga ditempatkan paling tinggi.

Sebagai pembanding, simulator publik pada situs CMD Finance menghitung angsuran di sisi server
dan rumusnya tidak dipublikasikan. Dari keluarannya terlihat bahwa biaya **tidak** bersifat
flat: biaya setara per tahun justru menurun seiring tenor memanjang. Pada pinjaman motor
Rp 3 juta, angkanya sekitar 98% pada tenor 6 bulan dan menjadi sekitar 51% pada tenor 36 bulan.
Pola tersebut menunjukkan adanya biaya administrasi di muka, sejalan dengan keterangan "sudah
termasuk bunga dan biaya admin" pada simulator mereka.

Karena rumus sebenarnya tidak dapat diketahui, model flat yang sederhana dan dapat
dipertanggungjawabkan lebih dipilih daripada menebak angka resmi mereka. Suku bunga di atas
sudah disesuaikan agar berada pada kisaran yang wajar bagi perusahaan pembiayaan, namun tetap
lebih rendah daripada keluaran simulator mereka karena di sini hanya mewakili bunga, tanpa
biaya administrasi.

### Identitas nasabah

Soal hanya mencantumkan nama lengkap sebagai identitas, padahal terdapat aturan "maksimal
pengajuan nasabah adalah sebanyak 3 kali". Aturan itu tidak dapat ditegakkan di atas nama: dua
orang dapat bernama sama, dan satu spasi tambahan sudah cukup untuk melewatinya.

Karena itu **field NIK ditambahkan** dan dipakai sebagai kunci identitas. Nomor tersebut memang
menjadi dasar setiap pengajuan kredit di Indonesia. Form tetap satu langkah seperti pada soal;
saat disimpan, sistem mencari nasabah dengan NIK tersebut dan membuatkannya bila belum ada.

### Status pengajuan

Soal hanya menyebut status Disetujui dan Ditolak, padahal pengajuan yang baru masuk belum
diproses. Status ketiga, **Menunggu**, ditambahkan sebagai status awal.

Perpindahan status bersifat sekali jalan. Tombol Setujui dan Tolak hanya muncul selama status
masih Menunggu, dan keputusan yang sudah diambil tidak dapat diubah kembali. Pemeriksaan ini
tidak hanya dilakukan di tampilan: aksi di server juga menolak permintaan atas pengajuan yang
sudah diproses.

### Batas nominal dan tenor

Soal menuliskan aturannya sebagai "nominal maksimal pinjaman yang **dapat disetujui** adalah
200 juta". Kata "disetujui" dibaca apa adanya, sehingga batas tersebut ditegakkan pada aksi
menyetujui, bukan sekadar pada form.

Konsekuensinya, pengajuan yang melampaui batas tetap boleh dicatat dan tetap boleh **ditolak**;
yang tidak diizinkan hanyalah menyetujuinya. Batas yang sama juga akan dicegah pada saat
pengisian demi kenyamanan, tetapi aksi persetujuan tetap memeriksanya sendiri agar data yang
tidak melewati form pun tidak lolos.

### Tampilan

Arah rancangan yang dipilih adalah **minimalis dengan penekanan pada keterbacaan**, bukan gaya
dekoratif. Aplikasi ini dipakai tim internal sepanjang hari, dan bagian terpentingnya adalah
tabel berkolom banyak — bentuk yang paling cepat berantakan bila diberi bayangan tebal dan
sudut yang terlalu membulat.

Ukuran teks isi dan kontrol form adalah 16 piksel, teks bantuan 14 piksel dengan warna yang
masih berkontras cukup, dan tinggi setiap kontrol 44 piksel agar nyaman disentuh maupun
diklik. Seluruh elemen yang dapat difokus menampilkan penanda fokus, sehingga aplikasi tetap
dapat ditelusuri sepenuhnya dengan papan ketik.

Form pengajuan tersusun dua kolom pada layar lebar agar muat satu layar tanpa menggulung, dan
menumpuk menjadi satu kolom pada layar sempit.

Kolom NIK, nominal, dan pendapatan hanya menerima angka: karakter selain digit disaring saat
diketik maupun ditempel, bukan sekadar ditolak ketika dikirim. Kolom `type="number"` sengaja
tidak dipakai karena menampilkan tombol putar, tetap menerima `e`, `+`, dan `-`, serta NIK 16
digit melewati batas presisi aman angka JavaScript. Pemeriksaan pada skema tetap
dipertahankan, karena penyaringan di peramban dapat dilewati sedangkan server tidak.

Nominal yang sedang diketik ditampilkan kembali dalam format rupiah sebagai teks bantuan,
untuk mencegah salah hitung nol pada angka besar.

### Warna

Warna merek diperkirakan dari logo publik CMD Finance, bukan dari panduan merek resmi.

Teks di atas warna emas selalu memakai warna hitam. Teks putih di atas emas hanya memiliki
rasio kontras sekitar 1,8 banding 1 dan tidak layak dibaca, sedangkan hitam mencapai sekitar
11 banding 1.

Warna emas sengaja tidak dipakai untuk menandai status pengajuan agar tidak tertukar dengan
identitas aplikasi. Status ditandai dengan warna **beserta** teks, sehingga tetap terbaca tanpa
bergantung pada kemampuan membedakan warna.

---

## Status pengerjaan

Proyek masih dalam pengerjaan. Bagian ini mencatat apa yang sudah berjalan.

| Kemampuan | Status |
|---|---|
| Form pengajuan dengan seluruh field yang diminta | Selesai |
| Penyimpanan pengajuan, termasuk pembuatan nasabah otomatis dari NIK | Selesai |
| Daftar pengajuan dalam bentuk tabel | Selesai |
| Perhitungan tagihan per bulan | Selesai |
| Halaman detail beserta rincian perhitungan | Selesai |
| Tombol Setujui dan Tolak beserta dialog konfirmasi | Selesai |
| Batas nominal dan tenor pada saat persetujuan | Selesai |
| Aturan pendapatan minimum dan batas jumlah pengajuan per nasabah | Selesai |
| Tampilan saat data kosong dan penanganan galat | Selesai |
| Perapian tampilan dan penelusuran dengan papan ketik | Selesai |

Yang tersisa adalah penyempurnaan dokumentasi dan pengujian ulang dari salinan repositori
yang masih bersih.

---

## Aturan bisnis

Seluruh aturan pada soal ditegakkan dalam tiga lapis. Lapis pertama dipakai bersama oleh
peramban dan server; dua lapis berikutnya hanya ada di server karena membutuhkan pembacaan
basis data atau melekat pada aksi tertentu.

| Aturan | Lapis | Perilaku |
|---|---|---|
| Pendapatan bulanan minimal Rp 1.000.000 | Skema bersama | Menolak dengan pesan "Nasabah belum dapat mengajukan pinjaman" |
| Nominal maksimal Rp 200.000.000 | Skema bersama, dan diperiksa ulang saat persetujuan | Dicegah saat pengisian; pengajuan yang melampaui batas tetap dapat ditolak, tetapi tidak dapat disetujui |
| Tenor maksimal 24 bulan, dengan kelipatan menurut tipe | Skema bersama | Nilai di luar daftar ditolak meskipun dikirim langsung ke server |
| Maksimal 3 pengajuan per nasabah | Server saja | Membutuhkan perhitungan pengajuan atas NIK yang sama |
| NIK tidak boleh terdaftar atas nama berbeda | Server saja | Membandingkan nama setelah penulisannya diseragamkan |

### Tenor menurut tipe pengajuan

| Tipe pengajuan | Kelipatan | Pilihan yang tersedia |
|---|---|---|
| Sepeda Motor | 3 bulan | 3, 6, 9, 12, 15, 18, 21, 24 |
| Mobil | 6 bulan | 6, 12, 18, 24 |
| Multiguna | 3 bulan | 3, 6, 9, 12, 15, 18, 21, 24 |

Mobil memakai kelipatan yang lebih kasar karena nominalnya jauh lebih besar dan tenornya
jarang ditawar per beberapa bulan. Batas 24 bulan berlaku untuk seluruh tipe, sesuai soal.

Yang disimpan pada kode adalah **aturannya** — kelipatan dan batas — bukan daftar jadinya,
sehingga tidak mungkin ada daftar yang diam-diam bertentangan dengan batas maksimalnya.

Karena tenor yang sah bergantung pada tipe, pemeriksaannya tidak dapat diletakkan pada field
itu sendiri dan naik ke tingkat objek. Kolom tenor juga dinonaktifkan sampai tipe dipilih, dan
mengganti tipe mereset pilihan tenor sebelumnya.

Pemeriksaan yang bergantung pada isi basis data dijalankan di dalam satu transaksi bersama
penyimpanannya. Tanpa itu, dua pengajuan yang dikirim bersamaan dapat sama-sama lolos batas
jumlah pengajuan.

Galat yang dikembalikan server ditampilkan pada field yang sama seperti galat dari peramban,
sehingga pengguna tidak perlu mengetahui pemeriksaan itu berasal dari mana.

---

## Penanganan galat

Kegagalan dipisahkan menurut sifatnya, karena masing-masing menuntut tanggapan berbeda.

| Keadaan | Tanggapan |
|---|---|
| Isian tidak memenuhi aturan | Pesan pada field yang bersangkutan, ditambah ringkasan di atas form |
| Pengajuan tidak ditemukan | Halaman 404 berbahasa Indonesia beserta tautan kembali ke daftar |
| Daftar pengajuan kosong | Ajakan mencatat pengajuan pertama, bukan tabel tanpa baris |
| Daftar sedang dimuat | Kerangka tampilan yang meniru tata letak tabel |
| Kegagalan tak terduga saat mengirim | Pesan pada form atau dialog, keadaan isian dipertahankan |
| Kegagalan saat merender halaman | Batas galat dengan tombol coba lagi dan kode galat |

Pesan galat asli tidak pernah ditampilkan kepada pengguna karena isinya dapat memuat detail
basis data. Yang ditampilkan hanya kode ringkas dari Next.js, sehingga galat di layar tetap
dapat dicocokkan dengan catatan di server.

---

## Keterbatasan yang diketahui

- **Tidak ada autentikasi maupun pembagian hak akses.** Siapa pun yang membuka aplikasi dapat
  melakukan seluruh tindakan.
- **Tidak ada jejak audit.** Aplikasi tidak mencatat siapa yang menyetujui atau menolak sebuah
  pengajuan, maupun nilai sebelum perubahan.
- **Suku bunga tersimpan sebagai konstanta di dalam kode**, bukan per pengajuan. Bila suku
  bunga diubah, angsuran pengajuan lama ikut berubah — perilaku yang tidak dapat diterima pada
  sistem sesungguhnya.
- **Daftar pengajuan belum memiliki pencarian maupun pembagian halaman.** Cukup untuk jumlah
  data prototype, tidak untuk data sesungguhnya.

---

## Yang akan diperbaiki bila waktu lebih panjang

1. **Autentikasi dan pembagian hak akses.** Tindakan menyetujui atau menolak seharusnya
   dibatasi pada peran tertentu, bukan terbuka bagi semua pengguna.
2. **Jejak audit pada setiap perubahan data**, mencatat siapa, kapan, dan nilai sebelum
   perubahan. Bagi sistem pembiayaan, ini kebutuhan terpenting setelah autentikasi, dan tidak
   dapat ditambahkan belakangan tanpa kehilangan riwayat lama.
3. **Pembekuan suku bunga per pengajuan**, sehingga perubahan suku bunga tidak menyentuh
   pengajuan yang sudah tercatat.
4. **Pencarian dan pembagian halaman** pada daftar pengajuan.
5. **Pemindahan basis data ke PostgreSQL** ketika aplikasi dipakai oleh banyak pengguna secara
   bersamaan.
