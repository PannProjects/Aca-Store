# 📚 MODEL LENGKAP - PENJELASAN BARIS PER BARIS

## DAFTAR ISI
1. [Apa itu Model?](#1-apa-itu-model)
2. [Model User](#2-model-user)
3. [Model Produk](#3-model-produk)
4. [Model Transaksi](#4-model-transaksi)
5. [Model Rating](#5-model-rating)
6. [Model ActivityLog](#6-model-activitylog)
7. [Cara Menggunakan Model](#7-cara-menggunakan-model)

---

# 1. Apa itu Model?

Model adalah **class PHP yang merepresentasikan satu tabel** di database.

## Konsep ORM (Object Relational Mapping)

```
┌──────────────────┐         ┌──────────────────┐
│   KODE PHP       │         │   DATABASE       │
├──────────────────┤         ├──────────────────┤
│ $user = new User │  ←→     │ tabel 'users'    │
│ $user->name      │  ←→     │ kolom 'name'     │
│ $user->save()    │  ←→     │ INSERT/UPDATE    │
│ User::find(1)    │  ←→     │ SELECT * WHERE   │
└──────────────────┘         └──────────────────┘
```

**Keuntungan menggunakan Model:**
- Tidak perlu menulis SQL manual
- Lebih aman (mencegah SQL injection)
- Mudah dibaca dan di-maintain
- Relasi antar tabel mudah diakses

---

# 2. Model User

File: `app/Models/User.php`

```php
<?php

namespace App\Models;
```
**Penjelasan:**
- `namespace` = Alamat lokasi file dalam struktur kode
- Semua model ada di folder `app/Models`

```php
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
```
**Penjelasan:**
- `use` = Mengimpor class dari lokasi lain
- `HasFactory` = Trait untuk factory (testing)
- `Authenticatable` = Base class untuk user yang bisa login
- `Notifiable` = Trait untuk mengirim notifikasi

```php
class User extends Authenticatable
{
    use HasFactory, Notifiable;
```
**Penjelasan:**
- `class User` = Mendefinisikan class bernama User
- `extends Authenticatable` = Mewarisi fitur autentikasi dari Laravel
- `use HasFactory, Notifiable` = Menggunakan trait

---

## 2.1 Property $fillable

```php
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
    ];
```

**Apa itu $fillable?**
Daftar kolom yang BOLEH diisi menggunakan mass assignment.

**Mass Assignment:**
```php
// DENGAN $fillable (aman)
User::create([
    'name' => 'John',
    'email' => 'john@example.com',
    'password' => 'hashed',
    'role' => 'user'  // Boleh karena ada di $fillable
]);

// TANPA $fillable (bahaya!)
// Hacker bisa mengirim 'role' => 'admin' lewat form
```

**Kebalikannya: $guarded**
```php
protected $guarded = ['id'];  // Semua KECUALI id boleh diisi
```

---

## 2.2 Property $hidden

```php
    protected $hidden = [
        'password',
        'remember_token',
    ];
```

**Fungsi:**
Kolom yang DISEMBUNYIKAN saat Model dikonversi ke JSON/Array.

```php
$user = User::find(1);
return response()->json($user);

// OUTPUT (password tidak muncul):
// {"id": 1, "name": "John", "email": "john@example.com", "role": "user"}
```

**Kenapa penting?**
- Password tidak boleh terlihat di API response
- Token tidak boleh diekspos

---

## 2.3 Method casts()

```php
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
```

**Apa itu Casting?**
Mengubah tipe data otomatis saat baca/tulis.

| Cast | Penjelasan |
|------|------------|
| `'datetime'` | String → Carbon object (mudah format tanggal) |
| `'hashed'` | Plain text → Hash otomatis saat disimpan |
| `'boolean'` | String → true/false |
| `'array'` | JSON string → PHP array |
| `'integer'` | String → Integer |

**Contoh penggunaan datetime:**
```php
$user->email_verified_at->format('d M Y');  // Output: 25 Jan 2026
$user->email_verified_at->diffForHumans();  // Output: 2 hours ago
```

---

## 2.4 Relasi hasMany

```php
    public function produks()
    {
        return $this->hasMany(Produk::class);
    }

    public function transaksis()
    {
        return $this->hasMany(Transaksi::class);
    }

    public function ratings()
    {
        return $this->hasMany(Rating::class);
    }
```

**Apa itu hasMany?**
Relasi "satu ke banyak" - 1 User punya BANYAK Produk/Transaksi/Rating.

**Diagram:**
```
USER (1) ─────────< TRANSAKSI (banyak)
  │
  ├───────────────< PRODUK (banyak)
  │
  └───────────────< RATING (banyak)
```

**Cara menggunakan:**
```php
$user = User::find(1);

// Mengakses semua transaksi user ini
$transaksis = $user->transaksis;

// Mengakses transaksi terbaru
$latest = $user->transaksis()->latest()->first();

// Menghitung jumlah transaksi
$count = $user->transaksis()->count();

// Filter transaksi
$paid = $user->transaksis()->where('status', 'paid')->get();
```

---

# 3. Model Produk

File: `app/Models/Produk.php`

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Produk extends Model
{
    protected $fillable = [
        'nama',
        'deskripsi',
        'harga',
        'lokasi_gambar',
        'stok',
        'user_id',
    ];

    /**
     * Relasi: Produk dimiliki oleh 1 User (Admin)
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Relasi: Produk punya banyak Rating
     */
    public function ratings()
    {
        return $this->hasMany(Rating::class);
    }
}
```

---

## 3.1 Relasi belongsTo

```php
public function user()
{
    return $this->belongsTo(User::class);
}
```

**Apa itu belongsTo?**
Relasi "dimiliki oleh" - kebalikan dari hasMany.

**Diagram:**
```
PRODUK ─────────> USER
  │
  │  Produk punya kolom 'user_id' yang merujuk ke 'id' di tabel users
  │
  └──── belongsTo berarti "produk ini DIMILIKI oleh user"
```

**Cara menggunakan:**
```php
$produk = Produk::find(1);

// Mengakses user yang membuat produk ini
$creator = $produk->user;
$creatorName = $produk->user->name;
```

---

## 3.2 Kombinasi Relasi

```php
// Eager Loading: Ambil produk + semua rating + user pemberi rating
$produk = Produk::with('ratings.user')->find(1);

// Akses data rating
foreach ($produk->ratings as $rating) {
    echo $rating->rating;        // 5
    echo $rating->user->name;    // Nama pemberi rating
}

// Hitung rata-rata rating
$avgRating = $produk->ratings()->avg('rating');
```

---

# 4. Model Transaksi

File: `app/Models/Transaksi.php`

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Transaksi extends Model
{
    protected $fillable = [
        'user_id',
        'produk_id',
        'kuantitas',
        'total_harga',
        'payment_method',
        'status',
        'game_id',
        'server_id',
        'bukti_pembayaran',  // Path ke file bukti transfer
    ];

    /**
     * Relasi: Transaksi dimiliki oleh 1 User (Pembeli)
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Relasi: Transaksi untuk 1 Produk
     */
    public function produk()
    {
        return $this->belongsTo(Produk::class);
    }
}
```

**Diagram Relasi:**
```
         ┌─────────────────┐
         │      USER       │
         └────────┬────────┘
                  │ hasMany
                  ▼
         ┌─────────────────┐
         │   TRANSAKSI     │
         └────────┬────────┘
                  │ belongsTo
                  ▼
         ┌─────────────────┐
         │     PRODUK      │
         └─────────────────┘
```

**Contoh penggunaan:**
```php
$transaksi = Transaksi::find(1);

// Mengakses user yang melakukan transaksi
$pembeli = $transaksi->user;
$namaPembeli = $transaksi->user->name;

// Mengakses produk yang dibeli
$produk = $transaksi->produk;
$namaProduk = $transaksi->produk->nama;

// Eager loading beberapa relasi
$transaksi = Transaksi::with(['user', 'produk'])->find(1);
```

---

# 5. Model Rating

File: `app/Models/Rating.php`

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Rating extends Model
{
    protected $fillable = [
        'user_id',
        'produk_id',
        'rating',
        'review',
    ];

    /**
     * User yang memberi rating
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Produk yang di-rating
     */
    public function produk()
    {
        return $this->belongsTo(Produk::class);
    }
}
```

**Diagram:**
```
USER ──hasMany──> RATING <──hasMany── PRODUK
         │                       │
         │  Rating menghubungkan │
         │  User dengan Produk   │
         └───────────────────────┘
```

---

# 6. Model ActivityLog

File: `app/Models/ActivityLog.php`

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Request;

class ActivityLog extends Model
{
    protected $fillable = [
        'user_id',
        'activity_type',
        'description',
        'metadata',
        'ip_address',
    ];

    /**
     * Cast metadata dari JSON string ke PHP array
     */
    protected $casts = [
        'metadata' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * STATIC METHOD: Cara mudah mencatat aktivitas
     * 
     * Contoh:
     * ActivityLog::log('login', 'User berhasil login');
     * ActivityLog::log('checkout', 'Membeli Diamond', ['total' => 50000]);
     */
    public static function log($type, $description, $metadata = null)
    {
        // Cek apakah ada user yang login
        if (!Auth::check()) return null;
        
        // Buat record baru
        return self::create([
            'user_id' => Auth::id(),           // ID user yang login
            'activity_type' => $type,           // Jenis: login, checkout, dll
            'description' => $description,      // Deskripsi aktivitas
            'metadata' => $metadata,            // Data tambahan (opsional)
            'ip_address' => Request::ip(),      // IP address user
        ]);
    }
}
```

---

## 6.1 Static Method

```php
public static function log(...)
```

**Apa itu Static Method?**
Method yang bisa dipanggil TANPA membuat instance/objek.

```php
// Static method (langsung dari class)
ActivityLog::log('login', 'User login');

// Non-static method (harus buat objek dulu)
$log = new ActivityLog();
$log->someMethod();
```

---

## 6.2 Casting JSON

```php
protected $casts = [
    'metadata' => 'array',
];
```

**Tanpa casting:**
```php
$log->metadata;  // Output: '{"produk_id": 5, "total": 50000}' (string)
```

**Dengan casting:**
```php
$log->metadata;            // Output: ['produk_id' => 5, 'total' => 50000] (array)
$log->metadata['total'];   // Output: 50000
```

---

# 7. Cara Menggunakan Model

## 7.1 Mengambil Data (SELECT)

```php
// Ambil semua data
$users = User::all();
$produks = Produk::all();

// Ambil dengan ID
$user = User::find(1);
$user = User::findOrFail(1);  // Error 404 jika tidak ada

// Ambil pertama
$user = User::first();
$user = User::latest()->first();

// Ambil dengan kondisi
$admins = User::where('role', 'admin')->get();
$mahal = Produk::where('harga', '>', 100000)->get();

// Kombinasi kondisi
$pending = Transaksi::where('status', 'pending')
    ->where('user_id', 1)
    ->get();

// whereIn
$paid = Transaksi::whereIn('status', ['paid', 'completed'])->get();

// Order
$latest = Produk::orderBy('created_at', 'desc')->get();
$latest = Produk::latest()->get();  // Shortcut

// Limit
$top5 = Produk::latest()->take(5)->get();

// Count
$total = User::count();
$admins = User::where('role', 'admin')->count();

// Sum, Avg, Max, Min
$totalRevenue = Transaksi::sum('total_harga');
$avgRating = Rating::avg('rating');
```

---

## 7.2 Membuat Data (INSERT)

```php
// Cara 1: create() - langsung simpan
$user = User::create([
    'name' => 'John',
    'email' => 'john@example.com',
    'password' => Hash::make('password'),
    'role' => 'user',
]);

// Cara 2: new + save()
$user = new User();
$user->name = 'John';
$user->email = 'john@example.com';
$user->password = Hash::make('password');
$user->role = 'user';
$user->save();

// Cara 3: firstOrCreate - buat jika belum ada
$user = User::firstOrCreate(
    ['email' => 'john@example.com'],  // Kondisi pencarian
    ['name' => 'John', 'role' => 'user']  // Data jika membuat baru
);
```

---

## 7.3 Mengubah Data (UPDATE)

```php
// Cara 1: update() pada instance
$user = User::find(1);
$user->update(['name' => 'John Doe']);

// Cara 2: Ubah property + save()
$user = User::find(1);
$user->name = 'John Doe';
$user->save();

// Cara 3: Update massal
User::where('role', 'user')->update(['role' => 'member']);

// Increment/Decrement
$produk->increment('stok', 10);    // stok + 10
$produk->decrement('stok', 5);     // stok - 5
```

---

## 7.4 Menghapus Data (DELETE)

```php
// Cara 1: delete() pada instance
$user = User::find(1);
$user->delete();

// Cara 2: destroy() dengan ID
User::destroy(1);
User::destroy([1, 2, 3]);

// Cara 3: Hapus massal dengan kondisi
User::where('role', 'guest')->delete();
```

---

## 7.5 Eager Loading (Optimasi)

```php
// TANPA eager loading (N+1 problem)
$transaksis = Transaksi::all();
foreach ($transaksis as $t) {
    echo $t->user->name;  // Query ke database setiap loop!
}
// Jika ada 100 transaksi = 101 query

// DENGAN eager loading
$transaksis = Transaksi::with('user')->get();
foreach ($transaksis as $t) {
    echo $t->user->name;  // Tidak ada query tambahan
}
// Total hanya 2 query

// Multiple relations
$transaksis = Transaksi::with(['user', 'produk'])->get();

// Nested relations
$produk = Produk::with('ratings.user')->get();
```

---

## DIAGRAM RELASI LENGKAP

```
┌─────────────────────────────────────────────────────────────────┐
│                     DIAGRAM RELASI                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│    ┌──────────┐                                                 │
│    │   USER   │                                                 │
│    ├──────────┤                                                 │
│    │ id       │◄───────────────────────────────────────┐        │
│    │ name     │                                        │        │
│    │ email    │                                        │        │
│    │ password │                                        │        │
│    │ role     │                                        │        │
│    └────┬─────┘                                        │        │
│         │                                              │        │
│         │ 1:N (hasMany)                                │        │
│         ▼                                              │        │
│    ┌──────────┐         ┌──────────┐         ┌────────┴─┐      │
│    │  PRODUK  │         │TRANSAKSI │         │ACTIVITY  │      │
│    ├──────────┤         ├──────────┤         │   LOG    │      │
│    │ id       │◄────────│produk_id │         ├──────────┤      │
│    │ nama     │         │ id       │         │ id       │      │
│    │ harga    │         │ user_id  │─────────│ user_id  │      │
│    │ stok     │         │ kuantitas│         │ type     │      │
│    │ user_id  │─────────│ status   │         │ desc     │      │
│    └────┬─────┘         └────┬─────┘         │ metadata │      │
│         │                    │               └──────────┘      │
│         │ 1:N                │ N:1                              │
│         ▼                    │                                  │
│    ┌──────────┐              │                                  │
│    │  RATING  │◄─────────────┘                                  │
│    ├──────────┤     (melalui user)                              │
│    │ id       │                                                 │
│    │ user_id  │                                                 │
│    │ produk_id│                                                 │
│    │ rating   │                                                 │
│    │ review   │                                                 │
│    └──────────┘                                                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```
