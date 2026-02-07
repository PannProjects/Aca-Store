# 🚀 Panduan Lengkap Deployment: Vercel + Supabase

Guide ini akan menuntun Anda langkah demi langkah untuk men-deploy aplikasi AcaStore agar bisa diakses online secara gratis.

---

## ✅ Persiapan (Wajib)

Pastikan Anda sudah login ke 3 akun ini:
1.  **[GitHub](https://github.com/)** (Untuk menyimpan kode)
2.  **[Supabase](https://supabase.com/)** (Untuk database online)
3.  **[Vercel](https://vercel.com/)** (Untuk hosting website)

---

## Langkah 1: Setup Database (Supabase)

Kita butuh database online pengganti MySQL lokal (Laragon).

1.  Buka [Dashboard Supabase](https://supabase.com/dashboard) dan klik **"New Project"**.
2.  Pilih Organization (atau buat baru).
3.  **Isi Form**:
    *   **Name**: `berkah-store` (atau bebas)
    *   **Database Password**: **PENTING!** Bikin password kuat dan **SIMPAN** di Notepad karena tidak bisa dilihat lagi.
    *   **Region**: Pilih `Singapore` (paling dekat dengan Indonesia).
4.  Klik **"Create new project"** dan tunggu loading selesai (hijau).
5.  **MENCARI KONEKSI DATABASE (Pilih salah satu cara):**

    **Cara A (Paling Mudah):**
    *   Klik tombol **"Connect"** di bagian atas dashboard.
    *   Pilih tab **"ORM"**.
    *   Pilih **"Prisma"** (Isinya sama formatnya).
    *   Lihat bagian `DATABASE_URL`. Isinya seperti ini:
        `postgresql://postgres.xxxx:[YOUR-PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres`
    *   Dari situ, ambil datanya:
        - **Host**: `aws-0-ap-southeast-1.pooler.supabase.com` (setelah `@` sampai `:6543`)
        - **Port**: `6543`
        - **User**: `postgres.xxxx` (sebelum `:`)
        - **Database**: `postgres` (paling akhir)

    **Cara B (Manual):**
    *   Masuk ke **Project Settings** (icon gear ⚙️ di kiri bawah) > **Database**.
    *   Scroll ke bagian **Connection parameters**.
    *   *(Jika kosong, pastikan project sudah selesai dibuat)*.
    *   Anda akan butuh data: `Host`, `Port`, `User`, `Database`.

    *(Password adalah yang Anda buat di langkah 3)*

---

## Langkah 2: Siapkan Kode & Aset

Agar tampilan web tidak "hancur" saat di-deploy, kita harus mem-build aset CSS/JS dan menguploadnya.

1.  Buka Terminal di VS Code (`Ctrl` + `` ` ``).
2.  Jalankan perintah ini untuk menyusun aset:
    ```bash
    npm run build
    ```
3.  Sekarang upload kode ke GitHub:
    ```bash
    git add .
    git commit -m "Persiapan deploy final"
    git push origin main
    ```
    *(Pastikan tidak ada error saat push)*

---

## Langkah 3: Deploy ke Vercel

1.  Buka [Dashboard Vercel](https://vercel.com/dashboard).
2.  Klik **"Add New..."** > **"Project"**.
3.  Di sebelah nama repo Anda (`berkah-store`), klik **"Import"**.
4.  **Konfigurasi Project** (Penting!):
    *   **Framework Preset**: Pilih `Other`.
    *   **Root Directory**: Biarkan `./`.
    *   **Environment Variables**: Klik tanda panah untuk membuka. Masukkan data ini satu per satu (Copy Paste):

    | Name (Kiri) | Value (Kanan) | Keterangan |
    | :--- | :--- | :--- |
    | `APP_KEY` | *(Salin dari file .env di laptop Anda)* | "base64:..." |
    | `APP_ENV` | `production` | - |
    | `APP_DEBUG` | `true` | Ubah false nanti jika sudah aman |
    | `APP_URL` | `https://nama-project.vercel.app` | Ganti dengan domain Vercel nanti |
    | `DB_CONNECTION` | `pgsql` | Wajib `pgsql` untuk Supabase |
    | `DB_HOST` | *(Host dari Supabase tadi)* | `db.xyz.supabase.co` |
    | `DB_PORT` | `6543` | - |
    | `DB_DATABASE` | `postgres` | - |
    | `DB_USERNAME` | `postgres` | - |
    | `DB_PASSWORD` | *(Password Database Anda)* | Yang Anda simpan tadi |

5.  Klik **"Deploy"**.
6.  Tunggu proses build selesai. Jika berhasil, Anda akan melihat kembang api 🎆.

---

## Langkah 4: Migrasi Database (Isi Tabel)

Saat ini website sudah online, tapi **Databasenya masih kosong** (belum ada tabel user, produk, dll). Kita harus mengisi tabelnya dari laptop.

1.  Di Vercel, buka menu **Settings** > **Domains**. Salin domain Anda (misal: `berkah-store.vercel.app`).
2.  Update Environment Variable `APP_URL` di Vercel dengan domain tersebut, lalu Redeploy (Deployment > Redeploy).

**Cara Mengisi Tabel (Migrasi):**

Kita akan menghubungkan laptop Anda sebentar ke database Supabase untuk mengirim struktur tabel.

1.  Buka file `.env` di laptop Anda.
2.  Ubah bagian database menjadi data **Supabase** (sementara saja):
    ```env
    DB_CONNECTION=pgsql
    DB_HOST=db.xyz...supabase.co
    DB_PORT=6543
    DB_DATABASE=postgres
    DB_USERNAME=postgres
    DB_PASSWORD=password_shhh_rahasia
    ```
3.  Buka Terminal laptop, jalankan:
    ```bash
    php artisan migrate
    ```
    *Ketik `yes` jika ditanya.*
4.  Isi data awal (Admin dll):
    ```bash
    php artisan db:seed
    ```
5.  **PENTING TERAKHIR**: Kembalikan file `.env` laptop Anda ke settingan awal (`mysql`, `127.0.0.1`, dll) agar Laragon Anda berjalan normal lagi.

---

## 🎉 Selesai!

Buka Link Vercel Anda, dan website AcaStore sudah siap digunakan!
Login Admin default:
*   Email: `cacathehills1@gmail.com`
*   Pass: `Tasyaputriaa123`
