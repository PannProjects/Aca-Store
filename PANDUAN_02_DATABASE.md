# 📚 DATABASE & MIGRATION LENGKAP - PENJELASAN BARIS PER BARIS

## DAFTAR ISI
1. [Konsep Database](#1-konsep-database)
2. [Apa itu Migration](#2-apa-itu-migration)
3. [Tabel Users](#3-tabel-users)
4. [Tabel Produks](#4-tabel-produks)
5. [Tabel Transaksis](#5-tabel-transaksis)
6. [Tabel Ratings](#6-tabel-ratings)
7. [Tabel Activity Logs](#7-tabel-activity-logs)
8. [Tipe Data Lengkap](#8-tipe-data-lengkap)
9. [Perintah Migration](#9-perintah-migration)

---

# 1. Konsep Database

## 1.1 Apa itu Database?

Database = Tempat menyimpan data secara terstruktur.

**Analogi:**
```
DATABASE    = Lemari arsip
TABEL       = Laci-laci di lemari
KOLOM       = Label kategori (Nama, Alamat, dll)
BARIS/ROW   = Satu data lengkap
```

**Contoh Tabel Users:**
```
┌────┬──────────┬──────────────────────┬──────────┐
│ id │   name   │        email         │   role   │
├────┼──────────┼──────────────────────┼──────────┤
│  1 │ Admin    │ admin@berkahstore.com│ admin    │
│  2 │ John     │ john@gmail.com       │ user     │
│  3 │ Jane     │ jane@yahoo.com       │ user     │
└────┴──────────┴──────────────────────┴──────────┘
```

## 1.2 Primary Key

**Primary Key** = Kolom unik yang mengidentifikasi setiap baris.

```php
$table->id();  // Membuat kolom 'id' sebagai Primary Key
```

Karakteristik:
- Unik (tidak boleh sama)
- Auto Increment (otomatis bertambah: 1, 2, 3, dst)
- Tidak boleh NULL

## 1.3 Foreign Key

**Foreign Key** = Kolom yang menghubungkan ke tabel lain.

```php
$table->foreignId('user_id')->constrained('users')->onDelete('cascade');
```

**Diagram:**
```
TABEL TRANSAKSIS                    TABEL USERS
┌────────────────┐                  ┌────────────────┐
│ id             │                  │ id             │◄────┐
│ user_id ───────│──────────────────│                │     │
│ produk_id      │                  │ name           │     │
│ ...            │                  │ email          │     │
└────────────────┘                  └────────────────┘     │
        │                                                   │
        │       Foreign Key 'user_id' menunjuk ke           │
        │       Primary Key 'id' di tabel users             │
        └───────────────────────────────────────────────────┘
```

---

# 2. Apa itu Migration?

Migration = Cara membuat tabel database menggunakan **kode PHP**.

**Keuntungan:**
| Tanpa Migration | Dengan Migration |
|-----------------|------------------|
| Tulis SQL manual | Tulis PHP |
| Sulit di-track dengan Git | Bisa di-track |
| Sulit kolaborasi tim | Mudah kolaborasi |
| Tidak bisa rollback | Bisa rollback |

**Membuat Migration:**
```bash
php artisan make:migration create_produks_table
```

**Hasil:** File di `database/migrations/xxxx_create_produks_table.php`

---

# 3. Tabel Users

File: `database/migrations/0001_01_01_000000_create_users_table.php`

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
```

**Penjelasan:**
- `use Illuminate\...` = Import class yang dibutuhkan
- `return new class` = Anonymous class yang extends Migration
- `extends Migration` = Mewarisi fitur migration dari Laravel

```php
    public function up(): void
    {
```
**Apa itu up()?**
Method yang dijalankan saat `php artisan migrate`.
Berisi perintah untuk MEMBUAT tabel.

```php
        Schema::create('users', function (Blueprint $table) {
```
**Penjelasan:**
- `Schema::create('users', ...)` = Membuat tabel bernama 'users'
- `function (Blueprint $table)` = Callback untuk mendefinisikan kolom
- `Blueprint $table` = Object untuk menambah kolom

```php
            $table->id();
```
| Kode | Hasil di Database |
|------|-------------------|
| `$table->id()` | `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY |

**Penjelasan:**
- Membuat kolom `id` sebagai Primary Key
- BIGINT = Angka besar (sampai 9 triliun)
- UNSIGNED = Hanya positif
- AUTO_INCREMENT = Otomatis bertambah

```php
            $table->string('name');
```
| Kode | Hasil di Database |
|------|-------------------|
| `$table->string('name')` | `name` VARCHAR(255) NOT NULL |

**Penjelasan:**
- VARCHAR(255) = Teks maksimal 255 karakter
- NOT NULL = Wajib diisi (tidak boleh kosong)

```php
            $table->string('email')->unique();
```
| Kode | Hasil di Database |
|------|-------------------|
| `->unique()` | Menambah UNIQUE constraint |

**Penjelasan:**
- Email tidak boleh sama dengan yang sudah ada
- Jika mencoba insert email yang sama, akan error

```php
            $table->timestamp('email_verified_at')->nullable();
```
| Kode | Hasil di Database |
|------|-------------------|
| `->nullable()` | Kolom boleh NULL (kosong) |

```php
            $table->string('password');
            $table->string('role')->default('user');
```
| Kode | Hasil di Database |
|------|-------------------|
| `->default('user')` | Nilai default jika tidak diisi |

```php
            $table->rememberToken();
```
**Penjelasan:**
Membuat kolom `remember_token` VARCHAR(100) untuk fitur "Remember Me".

```php
            $table->timestamps();
```
**Penjelasan:**
Membuat 2 kolom:
- `created_at` TIMESTAMP = Waktu data dibuat
- `updated_at` TIMESTAMP = Waktu data terakhir diubah

Laravel otomatis mengisi kedua kolom ini.

```php
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
```
**Apa itu down()?**
Method yang dijalankan saat `php artisan migrate:rollback`.
Kebalikan dari up() - untuk MENGHAPUS tabel.

---

# 4. Tabel Produks

File: `database/migrations/2026_01_11_063513_create_produks_table.php`

```php
Schema::create('produks', function (Blueprint $table) {
    $table->id();                                                   // 1
    $table->string('nama');                                         // 2
    $table->text('deskripsi');                                      // 3
    $table->decimal('harga', 15, 2);                                // 4
    $table->string('lokasi_gambar')->nullable();                    // 5
    $table->integer('stok')->default(0);                            // 6
    $table->foreignId('user_id')->constrained('users')              // 7
          ->onDelete('cascade');                                    // 8
    $table->timestamps();                                           // 9
});
```

**Penjelasan Baris per Baris:**

| No | Kode | Tipe SQL | Penjelasan |
|----|------|----------|------------|
| 1 | `id()` | BIGINT PK | Primary Key |
| 2 | `string('nama')` | VARCHAR(255) | Nama produk |
| 3 | `text('deskripsi')` | TEXT | Teks panjang tanpa batas 255 |
| 4 | `decimal('harga', 15, 2)` | DECIMAL(15,2) | Angka dengan 2 desimal |
| 5 | `string('lokasi_gambar')->nullable()` | VARCHAR(255) NULL | Path gambar, boleh kosong |
| 6 | `integer('stok')->default(0)` | INT DEFAULT 0 | Stok, default 0 |
| 7 | `foreignId('user_id')` | BIGINT UNSIGNED | Foreign Key ke users |
| 8 | `->onDelete('cascade')` | ON DELETE CASCADE | Hapus produk jika user dihapus |
| 9 | `timestamps()` | TIMESTAMP | created_at & updated_at |

**Penjelasan decimal(15, 2):**
```
decimal('harga', 15, 2)
            │    │   │
            │    │   └── 2 digit di belakang koma
            │    └────── Total 15 digit
            └─────────── Nama kolom

Contoh: 1234567890123.45 (total 15 digit, 2 di belakang koma)
Max: 9999999999999.99 (hampir 10 triliun)
```

**Penjelasan Foreign Key:**
```php
$table->foreignId('user_id')    // Buat kolom user_id
    ->constrained('users')      // Hubungkan ke tabel users (kolom id)
    ->onDelete('cascade');      // Jika user dihapus, hapus juga produknya
```

**Opsi onDelete:**
| Option | Penjelasan |
|--------|------------|
| `cascade` | Hapus data terkait |
| `set null` | Set ke NULL |
| `restrict` | Tolak penghapusan |
| `no action` | Sama dengan restrict |

---

# 5. Tabel Transaksis

File: `database/migrations/2026_01_11_063515_create_transaksis_table.php`

```php
Schema::create('transaksis', function (Blueprint $table) {
    $table->id();
    $table->foreignId('user_id')
          ->constrained('users')
          ->onDelete('cascade');
    $table->foreignId('produk_id')
          ->constrained('produks')
          ->onDelete('cascade');
    $table->integer('kuantitas');
    $table->decimal('total_harga', 15, 2);
    $table->string('payment_method')->nullable();
    $table->string('game_id')->nullable();
    $table->string('server_id')->nullable();
    $table->enum('status', ['pending', 'paid', 'completed', 'cancelled'])
          ->default('pending');
    $table->string('bukti_pembayaran')->nullable();  // Path ke file bukti transfer
    $table->timestamps();
});
```

**Penjelasan Kolom bukti_pembayaran:**
```php
$table->string('bukti_pembayaran')->nullable();
```
- Menyimpan path ke file gambar bukti pembayaran/transfer
- Nullable karena bisa diupload nanti (saat checkout sudah wajib)
- Contoh nilai: `bukti_pembayaran/abc123.jpg`

**Migration untuk Menambah Kolom:**

File: `database/migrations/2026_02_02_065819_add_bukti_pembayaran_to_transaksis_table.php`

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('transaksis', function (Blueprint $table) {
            $table->string('bukti_pembayaran')->nullable()->after('status');
        });
    }

    public function down(): void
    {
        Schema::table('transaksis', function (Blueprint $table) {
            $table->dropColumn('bukti_pembayaran');
        });
    }
};
```

**Penjelasan Migration Tambah Kolom:**

| Kode | Penjelasan |
|------|------------|
| `Schema::table()` | Modifikasi tabel yang sudah ada (bukan create) |
| `->after('status')` | Posisi kolom setelah kolom 'status' |
| `$table->dropColumn()` | Menghapus kolom saat rollback |

**Penjelasan enum():**
```php
$table->enum('status', ['pending', 'paid', 'completed', 'cancelled'])
```
ENUM = Kolom yang hanya bisa berisi nilai tertentu.

```
VALID: 'pending', 'paid', 'completed', 'cancelled'
INVALID: 'waiting', 'done', 'approved' → Error!
```

---

# 6. Tabel Ratings

```php
Schema::create('ratings', function (Blueprint $table) {
    $table->id();
    $table->foreignId('user_id')
          ->constrained('users')
          ->onDelete('cascade');
    $table->foreignId('produk_id')
          ->constrained('produks')
          ->onDelete('cascade');
    $table->tinyInteger('rating')->unsigned();  // 1-5
    $table->text('review')->nullable();
    $table->timestamps();
});
```

**Penjelasan tinyInteger():**
```php
$table->tinyInteger('rating')->unsigned();
```
- TINYINT = Angka 0-255 (unsigned) atau -128 sampai 127
- Cocok untuk rating 1-5
- Lebih hemat storage daripada INTEGER

---

# 7. Tabel Activity Logs

```php
Schema::create('activity_logs', function (Blueprint $table) {
    $table->id();
    $table->foreignId('user_id')
          ->constrained('users')
          ->onDelete('cascade');
    $table->string('activity_type');
    $table->string('description');
    $table->json('metadata')->nullable();
    $table->string('ip_address')->nullable();
    $table->timestamps();
});
```

**Penjelasan json():**
```php
$table->json('metadata');
```
Menyimpan data JSON di database.

```php
// Contoh data yang disimpan:
$metadata = [
    'produk_id' => 5,
    'total' => 50000,
    'items' => ['diamond', 'skin']
];

// Di database tersimpan sebagai:
// {"produk_id":5,"total":50000,"items":["diamond","skin"]}
```

---

# 8. Tipe Data Lengkap

| Method | Tipe SQL | Penjelasan |
|--------|----------|------------|
| `id()` | BIGINT PK AUTO | Primary Key |
| `string('x')` | VARCHAR(255) | Teks pendek |
| `string('x', 100)` | VARCHAR(100) | Teks dengan panjang custom |
| `text('x')` | TEXT | Teks panjang |
| `longText('x')` | LONGTEXT | Teks sangat panjang |
| `integer('x')` | INT | Angka -2M sampai 2M |
| `bigInteger('x')` | BIGINT | Angka sangat besar |
| `tinyInteger('x')` | TINYINT | Angka kecil (-128 sampai 127) |
| `decimal('x', 10, 2)` | DECIMAL | Angka desimal presisi |
| `float('x')` | FLOAT | Angka desimal (kurang presisi) |
| `boolean('x')` | TINYINT(1) | True/False |
| `date('x')` | DATE | Tanggal (YYYY-MM-DD) |
| `time('x')` | TIME | Waktu (HH:MM:SS) |
| `datetime('x')` | DATETIME | Tanggal + Waktu |
| `timestamp('x')` | TIMESTAMP | Seperti datetime dengan timezone |
| `json('x')` | JSON | Data JSON |
| `enum('x', [...])` | ENUM | Pilihan terbatas |
| `foreignId('x')` | BIGINT | Foreign Key |

**Modifier:**
| Modifier | Penjelasan |
|----------|------------|
| `->nullable()` | Boleh NULL |
| `->default($val)` | Nilai default |
| `->unique()` | Harus unik |
| `->unsigned()` | Hanya positif |
| `->after('col')` | Posisi setelah kolom tertentu |
| `->comment('text')` | Komentar kolom |

---

# 9. Perintah Migration

```bash
# Jalankan semua migration yang belum dijalankan
php artisan migrate

# Rollback migration terakhir
php artisan migrate:rollback

# Rollback semua migration
php artisan migrate:reset

# Rollback semua + migrate ulang
php artisan migrate:refresh

# Hapus semua tabel + migrate ulang
php artisan migrate:fresh

# Dengan seeder
php artisan migrate:fresh --seed

# Lihat status migration
php artisan migrate:status

# Membuat migration baru
php artisan make:migration create_nama_table

# Membuat migration untuk menambah kolom
php artisan make:migration add_kolom_to_tabel --table=nama_tabel
```

---

# DIAGRAM ERD LENGKAP

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          ENTITY RELATIONSHIP DIAGRAM                    │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────────────┐                                                    │
│  │     USERS       │                                                    │
│  ├─────────────────┤                                                    │
│  │ PK id           │◄─────────────────────────────────────────────┐     │
│  │    name         │                                              │     │
│  │    email        │◄────────────────────────────────────┐        │     │
│  │    password     │                                     │        │     │
│  │    role         │                                     │        │     │
│  │    created_at   │                                     │        │     │
│  │    updated_at   │                                     │        │     │
│  └────────┬────────┘                                     │        │     │
│           │                                              │        │     │
│           │ 1:N                                          │        │     │
│           ▼                                              │        │     │
│  ┌─────────────────┐        ┌─────────────────┐         │        │     │
│  │    PRODUKS      │        │   TRANSAKSIS    │         │        │     │
│  ├─────────────────┤        ├─────────────────┤         │        │     │
│  │ PK id           │◄───────│ FK produk_id    │         │        │     │
│  │    nama         │        │ PK id           │         │        │     │
│  │    deskripsi    │        │ FK user_id      │─────────┘        │     │
│  │    harga        │        │    kuantitas    │                  │     │
│  │    stok         │        │    total_harga  │                  │     │
│  │    lokasi_gambar│        │    status       │                  │     │
│  │ FK user_id ─────│────────│    payment_meth │                  │     │
│  │    created_at   │        │    game_id      │                  │     │
│  │    updated_at   │        │    server_id    │                  │     │
│  └────────┬────────┘        │    bukti_bayar  │                  │     │
│           │                 │    created_at   │                  │     │
│           │ 1:N             │    updated_at   │                  │     │
│           ▼                 └─────────────────┘                  │     │
│  ┌─────────────────┐        ┌─────────────────┐                  │     │
│  │    RATINGS      │        │  ACTIVITY_LOGS  │                  │     │
│  ├─────────────────┤        ├─────────────────┤                  │     │
│  │ PK id           │        │ PK id           │                  │     │
│  │ FK user_id ─────│────────│ FK user_id ─────│──────────────────┘     │
│  │ FK produk_id    │        │    activity_type│                        │
│  │    rating       │        │    description  │                        │
│  │    review       │        │    metadata     │                        │
│  │    created_at   │        │    ip_address   │                        │
│  │    updated_at   │        │    created_at   │                        │
│  └─────────────────┘        │    updated_at   │                        │
│                             └─────────────────┘                        │
│                                                                         │
│  LEGENDA:                                                               │
│  ──────────────                                                         │
│  PK = Primary Key                                                       │
│  FK = Foreign Key                                                       │
│  ◄── = Relasi (Many to One)                                            │
│  1:N = One to Many                                                      │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```
