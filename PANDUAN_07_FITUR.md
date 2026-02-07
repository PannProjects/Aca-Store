# 📚 BAB 7: PENJELASAN FITUR LENGKAP

## 7.1 Alur Aplikasi BerkahStore

```
┌─────────────────────────────────────────────────────────────────┐
│                        ALUR APLIKASI                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  [Guest]                                                        │
│     │                                                           │
│     ├──→ Lihat Produk ──→ Detail Produk                        │
│     │                                                           │
│     └──→ Register ──→ [User] ──→ Dashboard                     │
│                           │                                     │
│                           ├──→ Beli Produk                      │
│                           │      ↓                              │
│                           │    Checkout                         │
│                           │      ↓                              │
│                           │    Isi Form (Game ID, Server, dll)  │
│                           │      ↓                              │
│                           │    Upload Bukti Pembayaran          │
│                           │      ↓                              │
│                           │    Transaksi dibuat (pending)       │
│                           │      ↓                              │
│                           │    [Admin] Konfirmasi Pembayaran    │
│                           │      ↓                              │
│                           │    Status → paid                    │
│                           │      ↓                              │
│                           │    User bisa cetak Invoice & Rating │
│                           │                                     │
│                           ├──→ Halaman Pesanan (Riwayat)        │
│                           ├──→ Log Aktivitas                    │
│                           └──→ Edit Profil                      │
│                                                                 │
│  [Admin]                                                        │
│     │                                                           │
│     ├──→ Dashboard (Statistik)                                  │
│     ├──→ Kelola Produk (CRUD)                                   │
│     ├──→ Kelola User (Lihat, Hapus, Tambah Admin)              │
│     ├──→ Konfirmasi Pembayaran (dengan lihat bukti)             │
│     ├──→ Laporan Keuangan (filter tanggal/bulan/tahun)          │
│     └──→ Lihat Log Aktivitas Semua User                        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 7.2 Fitur Autentikasi

### Register (Daftar)
**Alur:**
1. User buka `/register`
2. Isi form (nama, email, password)
3. Klik "Daftar"
4. Data divalidasi
5. User dibuat di database
6. Auto login
7. Redirect ke home

**Validasi:**
- Nama wajib diisi
- Email harus unik
- Password minimal 8 karakter
- Password harus dikonfirmasi

### Login (Masuk)
**Alur:**
1. User buka `/login`
2. Isi email & password
3. System cek di database
4. Jika cocok → login berhasil
5. Redirect sesuai role (admin/user)

### Logout
- Sesi dihapus
- Token CSRF di-regenerate
- Redirect ke home

---

## 7.3 Fitur Transaksi

### Checkout (Beli)
**Alur:**
1. User klik "Beli" di halaman produk
2. Halaman checkout muncul
3. User isi:
   - Jumlah pembelian
   - Game ID
   - Server ID
   - Metode Pembayaran

4. User submit form
5. Sistem melakukan:
   - Validasi input
   - Cek stok produk
   - Upload bukti pembayaran
   - Hitung total harga
   - Buat transaksi (status: pending)
   - Kurangi stok produk
   - Catat di activity log

6. User redirect ke dashboard

### Upload Bukti Pembayaran
**Alur:**
1. User pilih metode pembayaran (QRIS, Transfer)
2. User upload gambar bukti transfer
3. Sistem validasi file (gambar, maks 2MB)
4. File disimpan di `storage/app/public/bukti_pembayaran/`
5. Admin bisa melihat bukti saat konfirmasi

**Validasi:**
- File wajib diupload
- Harus berupa gambar (jpeg, png, jpg, gif, webp)
- Maksimal 2MB

### Status Transaksi
| Status | Penjelasan |
|--------|------------|
| `pending` | Menunggu konfirmasi admin |
| `paid` | Sudah dibayar & dikonfirmasi |
| `completed` | Selesai (opsional) |
| `cancelled` | Dibatalkan (stok dikembalikan) |

---

## 7.4 Fitur Admin

### Dashboard Admin
Menampilkan statistik:
- Total pendapatan
- Jumlah produk
- Jumlah user
- Transaksi pending

### Kelola Produk
- **Tambah:** Form dengan gambar
- **Edit:** Form dengan gambar opsional
- **Hapus:** Konfirmasi → hapus

### Kelola User
- Lihat semua user & admin
- Hapus user
- Tambah admin baru

### Konfirmasi Pembayaran
- Lihat transaksi pending dengan bukti pembayaran
- Klik gambar bukti untuk melihat detail
- Konfirmasi → status = paid
- Tolak → status = cancelled, stok dikembalikan

### Laporan Keuangan
**Fitur:**
- Filter berdasarkan bulan dan tahun
- Filter berdasarkan rentang tanggal
- Lihat semua bulan dalam satu tahun
- Total pendapatan dan jumlah transaksi
- Breakdown per produk (produk terlaris)
- Grafik pendapatan bulanan (untuk view tahunan)

**Filter yang Tersedia:**
| Filter | Contoh |
|--------|--------|
| Bulan + Tahun | Februari 2026 |
| Semua Bulan | Tahun 2026 (semua bulan) |
| Rentang Tanggal | 1 Jan - 15 Jan 2026 |

---

## 7.5 Fitur Activity Log

### Aktivitas yang Dicatat

| Tipe | Deskripsi | Contoh |
|------|-----------|--------|
| `login` | User masuk | "Berhasil login ke sistem" |
| `logout` | User keluar | "Keluar dari sistem" |
| `register` | Daftar akun | "Mendaftar akun baru" |
| `checkout` | Beli produk | "Membeli Diamond 100 x2" |
| `rating` | Beri rating | "Memberi rating 5★ untuk Diamond 100" |
| `print_invoice` | Cetak nota | "Mencetak invoice #00001" |
| `update_profile` | Ubah profil | "Memperbarui profil" |
| `confirm_payment` | Admin konfirmasi | "Mengkonfirmasi pembayaran #00001" |
| `reject_payment` | Admin tolak | "Menolak pembayaran #00001" |
| `add_product` | Admin tambah produk | "Menambahkan produk: Diamond 500" |
| `edit_product` | Admin edit produk | "Mengedit produk: Diamond 500" |
| `delete_product` | Admin hapus produk | "Menghapus produk: Diamond 500" |
| `add_admin` | Tambah admin | "Menambahkan admin baru: John" |
| `delete_user` | Hapus user | "Menghapus user: Jane" |

### Cara Penggunaan
```php
ActivityLog::log('checkout', 'Membeli Diamond 100', [
    'produk_id' => 5,
    'total' => 50000,
]);
```

---

## 7.6 Fitur Invoice PDF

### Cara Kerja
1. User klik "Cetak PDF" di log aktivitas
2. Controller mengambil data transaksi
3. Load view `pdf/invoice.blade.php`
4. Generate PDF dengan DomPDF
5. Download file `invoice-{id}.pdf`

### Contoh Kode
```php
public function printPdf($id)
{
    $transaksi = Transaksi::with(['user', 'produk'])->findOrFail($id);
    
    $pdf = Pdf::loadView('pdf.invoice', compact('transaksi'));
    return $pdf->download('invoice-'.$transaksi->id.'.pdf');
}
```

---

## 7.7 Rating & Review

### Cara Kerja
1. User sudah bayar (status: paid)
2. Di halaman log, muncul form rating
3. User pilih bintang 1-5
4. Submit rating
5. Rating tersimpan
6. Tampil di halaman detail produk

---

## 7.8 Middleware & Keamanan

### CSRF Protection
Setiap form POST harus ada token CSRF untuk mencegah serangan.
```html
<form method="POST">
    @csrf
</form>
```

### Auth Middleware
Route yang butuh login dilindungi dengan `auth` middleware.
```php
Route::middleware(['auth'])->group(function () {
    // Hanya user login yang bisa akses
});
```

### Admin Middleware
Route admin dilindungi dengan middleware khusus.
```php
class EnsureAdmin
{
    public function handle($request, $next)
    {
        if (Auth::user()->role !== 'admin') {
            abort(403);
        }
        return $next($request);
    }
}
```

---

## 7.9 Daftar Lengkap File Proyek

```
app/
├── Http/
│   ├── Controllers/
│   │   ├── AuthController.php      → Login, register, logout
│   │   ├── HomeController.php      → Halaman home & detail produk
│   │   ├── UserController.php      → Dashboard & profil user
│   │   ├── TransaksiController.php → Checkout & invoice
│   │   └── AdminController.php     → Semua fitur admin
│   └── Middleware/
│       └── EnsureAdmin.php         → Cek role admin
├── Models/
│   ├── User.php
│   ├── Produk.php
│   ├── Transaksi.php
│   ├── Rating.php
│   └── ActivityLog.php

database/
└── migrations/
    ├── create_users_table.php
    ├── create_produks_table.php
    ├── create_transaksis_table.php
    ├── create_ratings_table.php
    └── create_activity_logs_table.php

resources/views/
├── layouts/
│   └── app.blade.php      → Layout utama
├── auth/
│   ├── login.blade.php
│   └── register.blade.php
├── admin/
│   ├── dashboard.blade.php
│   ├── produk.blade.php
│   ├── edit_produk.blade.php
│   ├── users.blade.php
│   ├── pembayaran.blade.php
│   ├── laporan.blade.php   → Laporan keuangan
│   └── log.blade.php
├── user/
│   ├── dashboard.blade.php
│   ├── activity_log.blade.php
│   ├── pesanan.blade.php   → Halaman daftar pesanan
│   └── edit_profile.blade.php
├── transaksi/
│   └── checkout.blade.php  → Form dengan upload bukti
├── produk/
│   └── show.blade.php
├── pdf/
│   └── invoice.blade.php
└── welcome.blade.php

routes/
└── web.php               → Semua URL aplikasi
```

---

## 7.10 Perintah untuk Menjalankan

```bash
# 1. Masuk ke folder proyek
cd C:\laragon\www\BerkahStore

# 2. Install dependensi
composer install

# 3. Copy file environment
copy .env.example .env

# 4. Generate application key
php artisan key:generate

# 5. Konfigurasi database di .env

# 6. Jalankan migration
php artisan migrate

# 7. (Opsional) Isi data dummy
php artisan db:seed

# 8. Buat storage link untuk gambar
php artisan storage:link

# 9. Jalankan server
php artisan serve

# 10. Buka browser: http://127.0.0.1:8000
```

---

## 🎉 SELESAI!

Anda telah mempelajari:
- ✅ Instalasi Laravel
- ✅ Database & Migration
- ✅ Model & Relasi
- ✅ Routes (URL)
- ✅ Controller (Logika)
- ✅ View & Blade Template
- ✅ Semua Fitur Aplikasi

**Tips Selanjutnya:**
1. Coba modifikasi tampilan
2. Tambahkan fitur baru
3. Pelajari API (Laravel Sanctum)
4. Pelajari testing

> 💡 **Ingat:** Belajar coding butuh praktik. Jangan hanya baca, tapi juga KETIK kodenya sendiri!
