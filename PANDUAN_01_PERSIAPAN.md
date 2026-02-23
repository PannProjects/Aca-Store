# 📚 BAB 1: PERSIAPAN & INSTALASI

## 1.1 Apa itu Website?

Website adalah kumpulan halaman yang bisa diakses melalui internet menggunakan browser (Chrome, Firefox, dll).

**Contoh:** Google.com, YouTube.com, Tokopedia.com

Website terdiri dari 2 bagian:
- **Frontend** = Tampilan yang dilihat user (HTML, CSS, JavaScript)
- **Backend** = Logika di server (PHP, Python, dll)

---

## 1.2 Apa itu Laravel?

Laravel adalah **framework PHP** untuk membuat website backend.

**Framework** = Kerangka kerja yang menyediakan alat-alat siap pakai.

**Analogi:** Jika membuat website seperti membangun rumah:
- **Tanpa framework** = Membuat batu bata sendiri, mencampur semen sendiri
- **Dengan Laravel** = Batu bata & semen sudah tersedia, tinggal susun

---

## 1.3 Apa yang Perlu Diinstall?

### A. Laragon (Untuk Windows)
**Fungsi:** Menjalankan PHP, MySQL, dan Apache di komputer lokal.

Download: https://laragon.org/download/

Setelah install, Laragon menyediakan:
- **PHP** = Bahasa pemrograman
- **MySQL** = Database untuk menyimpan data
- **Apache** = Web server

### B. Composer
**Fungsi:** Package manager untuk PHP (seperti Play Store untuk aplikasi).

Download: https://getcomposer.org/download/

### C. Visual Studio Code (VS Code)
**Fungsi:** Editor untuk menulis kode.

Download: https://code.visualstudio.com/

---

## 1.4 Membuat Proyek Laravel Baru

Buka terminal (di Laragon: klik kanan1. Buka Terminal/Command Prompt.
2. Jalankan perintah berikut:
```bash
composer create-project laravel/laravel AcaStore
```

**Penjelasan:**
- `cd C:\laragon\www` = Pindah ke folder www
- `composer create-project` = Perintah untuk membuat proyek baru
- `laravel/laravel` = Template Laravel
- `AcaStore` = Nama folder proyek 

---

## 1.5 Menjalankan Server Lokal

```bash
cd AcaStore
php artisan serve
```

Buka browser dan akses: **http://127.0.0.1:8000**

Jika muncul halaman Laravel, berarti instalasi berhasil! 🎉

---

## 1.6 Konfigurasi Database

### Langkah 1: Buat Database
1. Buka Laragon → Start All
2. Klik kanan → MySQL → Open HeidiSQL
3. Klik kanan → Create New → Database
4. Nama: `acastore`

### Langkah 2: Edit File .env
Buka file `.env` di folder proyek:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=acastore
DB_USERNAME=root
DB_PASSWORD=
```

**Penjelasan:**
- `DB_DATABASE` = Nama database yang baru dibuat
- `DB_USERNAME` = Username MySQL (default: root)
- `DB_PASSWORD` = Password MySQL (default: kosong)

---

## 1.7 Struktur Folder Laravel

```
AcaStore/
├── app/                      ← KODE APLIKASI
│   ├── Http/
│   │   └── Controllers/      ← Pengontrol logika
│   └── Models/               ← Representasi tabel database
│
├── config/                   ← File konfigurasi
│
├── database/
│   ├── migrations/           ← File untuk membuat tabel
│   └── seeders/              ← Data awal/dummy
│
├── public/                   ← File publik (gambar, css, js)
│
├── resources/
│   └── views/                ← File tampilan (HTML)
│
├── routes/
│   └── web.php               ← Daftar URL
│
├── storage/                  ← File yang di-upload
│
├── .env                      ← Konfigurasi environment
└── composer.json             ← Daftar package
```

---

## 1.8 Perintah Artisan yang Sering Dipakai

Artisan adalah command-line tool bawaan Laravel.

| Perintah | Fungsi |
|----------|--------|
| `php artisan serve` | Menjalankan server lokal |
| `php artisan migrate` | Menjalankan migration (buat tabel) |
| `php artisan migrate:fresh` | Hapus semua tabel & buat ulang |
| `php artisan make:model Nama -m` | Buat model + migration |
| `php artisan make:controller NamaController` | Buat controller |
| `php artisan route:list` | Lihat semua routes |

---

## ✅ Checklist Persiapan

- [ ] Laragon terinstall
- [ ] Composer terinstall
- [ ] VS Code terinstall
- [ ] Proyek Laravel berhasil dibuat
- [ ] Database sudah dikonfigurasi
- [ ] Server berjalan di localhost:8000

---

> 📖 **Lanjut ke:** [PANDUAN_02_DATABASE.md](./PANDUAN_02_DATABASE.md)
