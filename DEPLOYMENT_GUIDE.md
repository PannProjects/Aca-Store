# Panduan Deployment: Vercel + Supabase

Panduan ini akan membantu Anda mengonlinekan project Laravel BerkahStore menggunakan hosting gratis Vercel dan database Supabase.

> [!IMPORTANT]
> Pastikan Anda memiliki akun [GitHub](https://github.com/), [Vercel](https://vercel.com/), dan [Supabase](https://supabase.com/).

## 1. Persiapan Database (Supabase)

1.  Login ke **Supabase** dan buat **New Project**.
2.  Isi nama project dan generate password database yang kuat (Simpan password ini!).
3.  Tunggu hingga database selesai dibuat.
4.  Buka menu **Project Settings** (icon gear di bawah) -> **Database**.
5.  Cari bagian **Connection parameters**.
6.  Anda akan membutuhkan data berikut nanti untuk Environment Variables di Vercel:
    -   **Host** (misal: `db.kjsdhfkjsd.supabase.co`)
    -   **Database Name** (biasanya `postgres`)
    -   **Port** (6543)
    -   **User** (biasanya `postgres`)
    -   **Password** (yang Anda buat di langkah 2)

## 2. Persiapan Source Code (GitHub)

1.  Pastikan project Anda sudah di-push ke repository GitHub.
2.  Jika belum:
    ```bash
    git init
    git add .
    git commit -m "Siap deploy"
    git branch -M main
    # Ganti URL di bawah dengan URL repo GitHub Anda
    git remote add origin https://github.com/USERNAME/REPO-ANDA.git
    git push -u origin main
    ```

## 3. Deployment ke Vercel

1.  Login ke **Vercel** dan klik **Add New...** -> **Project**.
2.  Import repository GitHub Anda.
3.  Konfigurasi Project:
    -   **Framework Preset**: Biarkan `Other`.
    -   **Root Directory**: Biarkan `./`.
4.  **Environment Variables**:
    Klik bagian Environment Variables dan tambahkan satu per satu sesuai data dari Supabase dan Laravel:

    | Key | Value (Contoh) |
    | :--- | :--- |
    | `APP_KEY` | `base64:...` (Salin dari file .env lokal Anda) |
    | `APP_ENV` | `production` |
    | `APP_DEBUG` | `true` (Ubah false nanti jika sudah lancar) |
    | `APP_URL` | Kosongkan dulu (Vercel akan mengisi otomatis) |
    | `DB_CONNECTION` | `pgsql` |
    | `DB_HOST` | `db.xyz.supabase.co` (Host dari Supabase) |
    | `DB_PORT` | `6543` |
    | `DB_DATABASE` | `postgres` |
    | `DB_USERNAME` | `postgres` |
    | `DB_PASSWORD` | `password_anda` |

5.  Klik **Deploy**.

## 4. Migrasi Database

Karena kita tidak bisa login SSH ke Vercel, cara termudah migrasi database adalah menghubungkan laptop lokal Anda ke database Supabase sementara untuk menjalankan migrasi.

**Cara Termudah (Menghubungkan Lokal ke Supabase):**

1.  Edit file `.env` di **KOMPUTER LOKAL ANDA** (jangan commit perubahan ini, hanya sementara).
2.  Ubah konfigurasi DB menjadi data Supabase:
    ```env
    DB_CONNECTION=pgsql
    DB_HOST=db.xyz.supabase.co
    DB_PORT=6543
    DB_DATABASE=postgres
    DB_USERNAME=postgres
    DB_PASSWORD=password_anda
    ```
3.  Jalankan migrasi dari terminal lokal:
    ```bash
    php artisan migrate
    ```
    *(Jika diminta konfirmasi karena production, ketik `yes`)*
4.  Jalankan seeder (jika perlu):
    ```bash
    php artisan db:seed
    ```
5.  **PENTING**: Kembalikan file `.env` lokal Anda ke settingan database lokal (`mysql` / localhost) agar development di laptop kembali normal.

## 5. Cek Hasil

Buka URL yang diberikan Vercel. Aplikasi Anda seharusnya sudah berjalan!

> [!NOTE]
> Jika ada error 500, cek "Logs" di dashboard Vercel untuk melihat detail error.
> Biasanya karena salah copy `APP_KEY` atau koneksi database gagal.
