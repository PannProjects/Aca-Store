# 📚 BAB 4: ROUTES (URL)

## 4.1 Apa itu Routes?

Routes menghubungkan **URL dengan Controller**.

Saat user mengakses `http://localhost/login`, Laravel mencari route yang cocok, lalu menjalankan fungsi di Controller.

File routes: `routes/web.php`

---

## 4.2 File Routes Lengkap

```php
<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\TransaksiController;
use App\Http\Middleware\EnsureAdmin;

// ========================================
// HALAMAN PUBLIK (tanpa login)
// ========================================

// Halaman utama - menampilkan semua produk
Route::get('/', [HomeController::class, 'index'])->name('home');

// Detail produk
Route::get('/produk/{id}', [HomeController::class, 'show'])->name('produk.show');

// ========================================
// AUTENTIKASI
// ========================================

// Tampilkan form login
Route::get('/login', [AuthController::class, 'showLogin'])->name('login');

// Proses login (saat form disubmit)
Route::post('/login', [AuthController::class, 'login']);

// Tampilkan form register
Route::get('/register', [AuthController::class, 'showRegister'])->name('register');

// Proses register
Route::post('/register', [AuthController::class, 'register']);

// Logout
Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

// ========================================
// HALAMAN USER (perlu login)
// ========================================

Route::middleware(['auth'])->group(function () {
    
    // Dashboard user
    Route::get('/dashboard', [UserController::class, 'index'])
        ->name('user.dashboard');
    
    // Log aktivitas user
    Route::get('/log-aktivitas', [UserController::class, 'activityLog'])
        ->name('user.activity_log');
    
    // Halaman daftar pesanan user
    Route::get('/pesanan', [UserController::class, 'pesanan'])
        ->name('user.pesanan');
    
    // Halaman checkout
    Route::get('/checkout/{id}', [TransaksiController::class, 'checkout'])
        ->name('transaksi.checkout');
    
    // Proses pembelian
    Route::post('/buy', [TransaksiController::class, 'store'])
        ->name('transaksi.store');
    
    // Kirim rating
    Route::post('/rate', [UserController::class, 'rate'])
        ->name('rating.store');
    
    // Cetak invoice PDF
    Route::get('/invoice/{id}', [TransaksiController::class, 'printPdf'])
        ->name('invoice.print');
    
    // Edit profil
    Route::get('/profile', [UserController::class, 'editProfile'])
        ->name('profile.edit');
    Route::put('/profile', [UserController::class, 'updateProfile'])
        ->name('profile.update');
});

// ========================================
// HALAMAN ADMIN (perlu login + role admin)
// ========================================

Route::middleware(['auth'])->group(function () {
    Route::prefix('admin')->middleware(EnsureAdmin::class)->group(function () {
        
        // Dashboard admin
        Route::get('/', [AdminController::class, 'index'])
            ->name('admin.dashboard');
        
        // --- PRODUK MANAGEMENT ---
        Route::get('/produk', [AdminController::class, 'produkIndex'])
            ->name('admin.produk.index');
        Route::post('/produk', [AdminController::class, 'storeProduk'])
            ->name('admin.produk.store');
        Route::get('/produk/{id}/edit', [AdminController::class, 'editProduk'])
            ->name('admin.produk.edit');
        Route::put('/produk/{id}', [AdminController::class, 'updateProduk'])
            ->name('admin.produk.update');
        Route::delete('/produk/{id}', [AdminController::class, 'destroyProduk'])
            ->name('admin.produk.destroy');
        
        // --- USER MANAGEMENT ---
        Route::get('/users', [AdminController::class, 'usersIndex'])
            ->name('admin.users.index');
        Route::post('/add-admin', [AdminController::class, 'storeAdmin'])
            ->name('admin.store');
        Route::delete('/user/{id}', [AdminController::class, 'destroyUser'])
            ->name('admin.user.destroy');
        
        // --- PEMBAYARAN ---
        Route::get('/pembayaran', [AdminController::class, 'pembayaranIndex'])
            ->name('admin.pembayaran');
        Route::post('/transaction/{id}/{status}', [AdminController::class, 'confirmPayment'])
            ->name('admin.transaction.confirm');
        
        // --- LOG AKTIVITAS ---
        Route::get('/log', [AdminController::class, 'logIndex'])
            ->name('admin.log');
        
        // --- LAPORAN KEUANGAN ---
        Route::get('/laporan', [AdminController::class, 'laporanKeuangan'])
            ->name('admin.laporan');
    });
});
```

---

## 4.3 Penjelasan Sintaks Routes

### Route::get()
```php
Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
```

| Bagian | Penjelasan |
|--------|------------|
| `Route::get()` | Untuk request GET (buka halaman) |
| `'/login'` | URL yang diakses |
| `AuthController::class` | Nama Controller |
| `'showLogin'` | Nama Method di Controller |
| `->name('login')` | Nama route (untuk referensi) |

### Route::post()
```php
Route::post('/login', [AuthController::class, 'login']);
```
Untuk request POST (submit form).

### Route::put() / Route::delete()
Untuk update dan hapus data.

---

## 4.4 Route Parameter

```php
Route::get('/produk/{id}', [HomeController::class, 'show']);
```

`{id}` adalah parameter dinamis. Contoh:
- `/produk/1` → $id = 1
- `/produk/5` → $id = 5

Di Controller:
```php
public function show($id)
{
    $produk = Produk::find($id);
    // ...
}
```

---

## 4.5 Middleware

Middleware = "Penjaga gerbang" sebelum request masuk ke Controller.

### Middleware 'auth'
```php
Route::middleware(['auth'])->group(function () {
    // Routes di sini hanya bisa diakses user yang login
});
```

### Middleware EnsureAdmin
```php
Route::middleware(EnsureAdmin::class)->group(function () {
    // Routes di sini hanya bisa diakses admin
});
```

File: `app/Http/Middleware/EnsureAdmin.php`
```php
public function handle($request, $next)
{
    if (Auth::user()->role !== 'admin') {
        abort(403); // Forbidden
    }
    return $next($request);
}
```

---

## 4.6 Route Groups

### prefix()
```php
Route::prefix('admin')->group(function () {
    Route::get('/', ...);        // URL: /admin
    Route::get('/produk', ...);  // URL: /admin/produk
});
```

### group()
Mengelompokkan routes dengan middleware yang sama.

---

## 4.7 Menggunakan Named Routes

Di Blade:
```html
<a href="{{ route('login') }}">Login</a>
<a href="{{ route('produk.show', $produk->id) }}">Detail</a>
```

Di Controller:
```php
return redirect()->route('home');
return redirect()->route('produk.show', ['id' => 5]);
```

---

## 4.8 Melihat Semua Routes

```bash
php artisan route:list
```

Output:
```
GET    /              home
GET    /login         login
POST   /login         
GET    /produk/{id}   produk.show
...
```

---

> 📖 **Lanjut ke:** [PANDUAN_05_CONTROLLER.md](./PANDUAN_05_CONTROLLER.md)
