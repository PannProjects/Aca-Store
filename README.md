<div align="center">

# 🎮 AcaStore
### Platform Topup Game Termurah & Terpercaya

![AcaStore Banner](public/logo.png)

[![Laravel](https://img.shields.io/badge/Laravel-11.x-FF2D20?style=for-the-badge&logo=laravel)](https://laravel.com)
[![React](https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.x-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com)

<p align="center">
  <a href="#fitur-unggulan">Fitur</a> •
  <a href="#teknologi">Teknologi</a> •
  <a href="#instalasi">Instalasi</a> •
  <a href="#team">Team</a>
</p>

</div>

---

## ✨ Tentang Project

**AcaStore** adalah platform topup voucher game berbasis web yang dirancang untuk memberikan pengalaman transaksi yang **cepat**, **aman**, dan **estetik**. Dibangun dengan teknologi modern untuk performa maksimal dan tampilan yang memanjakan mata.

## 🚀 Fitur Unggulan

- ⚡ **Transaksi Instan** - Alur checkout yang ringkas dan cepat.
- 🌙 **Dark Mode Support** - Tampilan elegan yang nyaman di mata siang & malam.
- 💳 **Multi-Payment** - Dukungan QRIS, Dana, dan GoPay.
- 🔒 **Admin Panel** - Dashboard lengkap untuk kelola Produk, Transaksi, dan User.
- 📱 **Responsive Design** - Tampilan sempurna di Desktop, Tablet, dan Mobile.
- 🛠️ **Maintenance Mode** - Sistem otomatis untuk menonaktifkan produk yang sedang gangguan.

## 💻 Teknologi

Project ini dibangun menggunakan stack modern:

- **Backend**: Laravel 11 (PHP 8.2+)
- **Frontend**: React.js + Inertia.js
- **Styling**: Tailwind CSS + Headless UI
- **Database**: MySQL / MariaDB

## 📦 Instalasi

Ikuti langkah, berikut untuk menjalankan project di komputer lokal Anda:

1. **Clone Repository**
   ```bash
   git clone https://github.com/username/berkah-store.git
   cd berkah-store
   ```

2. **Install Dependencies**
   ```bash
   composer install
   npm install
   ```

3. **Setup Environment**
   Duplikat file `.env.example` menjadi `.env` dan sesuaikan konfigurasi database.
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

4. **Database Migration & Seeder**
   ```bash
   php artisan migrate:fresh --seed
   ```
   *Default Admin: Gunakan kredensial yang ada di file `.env` atau seeder.*

5. **Jalankan Server**
   ```bash
   # Terminal 1
   php artisan serve

   # Terminal 2
   npm run dev
   ```

## 👥 Team

Dibuat dengan ❤️ oleh:

- **Pandu** - *Backend & DevOps*
- **Aca** - *Frontend & Design*

---

<div align="center">
  <small>© 2026 AcaStore. All Rights Reserved.</small>
</div>
