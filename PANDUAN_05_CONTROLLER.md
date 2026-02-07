# 📚 CONTROLLER LENGKAP - PENJELASAN BARIS PER BARIS

## DAFTAR ISI
1. [AuthController](#1-authcontroller)
2. [HomeController](#2-homecontroller)
3. [UserController](#3-usercontroller)
4. [TransaksiController](#4-transaksicontroller)
5. [AdminController](#5-admincontroller)

---

# 1. AuthController

File: `app/Http/Controllers/AuthController.php`

Controller ini menangani semua proses autentikasi: login, register, dan logout.

```php
<?php

namespace App\Http\Controllers;
```
**Penjelasan:**
- `<?php` = Tag pembuka PHP
- `namespace` = Alamat folder dalam kode. Semua controller ada di `App\Http\Controllers`

```php
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\ActivityLog;
```
**Penjelasan:**
- `use` = Mengimpor class dari lokasi lain (seperti include)
- `Request` = Class untuk mengambil data dari form
- `Auth` = Class untuk autentikasi (login, logout, cek user)
- `Hash` = Class untuk enkripsi password
- `User` = Model User yang kita buat
- `ActivityLog` = Model untuk mencatat aktivitas

```php
class AuthController extends Controller
{
```
**Penjelasan:**
- `class AuthController` = Membuat class baru bernama AuthController
- `extends Controller` = Mewarisi fitur dari Controller bawaan Laravel

---

## Method: showLogin()

```php
public function showLogin()
{
    return view('auth.login');
}
```

| Bagian | Penjelasan |
|--------|------------|
| `public` | Method bisa dipanggil dari luar class |
| `function showLogin()` | Nama method |
| `return view('auth.login')` | Menampilkan file `resources/views/auth/login.blade.php` |

**Kapan dipanggil?** Saat user membuka URL `/login`

---

## Method: login()

```php
public function login(Request $request)
{
```
**Penjelasan:**
- `Request $request` = Parameter yang berisi semua data dari form
- Contoh: `$request->email` mengambil nilai input email

```php
    $credentials = $request->validate([
        'email' => ['required', 'email'],
        'password' => ['required'],
    ]);
```
**Penjelasan:**
- `validate()` = Memeriksa input sesuai aturan
- `'required'` = Wajib diisi
- `'email'` = Harus format email (xxx@xxx.xxx)
- Jika validasi gagal, otomatis kembali ke halaman sebelumnya dengan pesan error

```php
    if (Auth::attempt($credentials)) {
```
**Penjelasan:**
- `Auth::attempt()` = Mencoba login dengan email & password
- Mengembalikan `true` jika berhasil, `false` jika gagal
- Laravel otomatis mengecek password yang di-hash

```php
        $request->session()->regenerate();
```
**Penjelasan:**
- `session()->regenerate()` = Membuat session ID baru
- Untuk keamanan agar session lama tidak bisa dipakai

```php
        ActivityLog::log('login', 'Berhasil login ke sistem');
```
**Penjelasan:**
- Memanggil method `log()` di model ActivityLog
- Mencatat aktivitas "login" ke database

```php
        if (Auth::user()->role == 'admin') {
            return redirect()->route('admin.dashboard');
        }
        return redirect()->route('home');
```
**Penjelasan:**
- `Auth::user()` = Mengambil data user yang sedang login
- `->role` = Mengakses kolom role
- Jika admin, redirect ke dashboard admin
- Jika user biasa, redirect ke home

```php
    }
    return back()->withErrors([
        'email' => 'Email atau password salah.',
    ])->onlyInput('email');
}
```
**Penjelasan:**
- `back()` = Kembali ke halaman sebelumnya
- `withErrors()` = Mengirim pesan error
- `onlyInput('email')` = Mengingat nilai email yang diketik

---

## Method: register()

```php
public function register(Request $request)
{
    $request->validate([
        'name' => 'required|string|max:255',
        'email' => 'required|email|unique:users',
        'password' => 'required|min:8|confirmed',
    ], [
        'name.required' => 'Nama wajib diisi.',
        'email.required' => 'Email wajib diisi.',
        'email.email' => 'Format email tidak valid.',
        'email.unique' => 'Email sudah terdaftar.',
        'password.required' => 'Password wajib diisi.',
        'password.min' => 'Password minimal 8 karakter.',
        'password.confirmed' => 'Konfirmasi password tidak cocok.',
    ]);
```

**Aturan Validasi:**

| Aturan | Penjelasan |
|--------|------------|
| `required` | Wajib diisi |
| `string` | Harus berupa teks |
| `max:255` | Maksimal 255 karakter |
| `email` | Format email valid |
| `unique:users` | Tidak boleh sama dengan yang ada di tabel users |
| `min:8` | Minimal 8 karakter |
| `confirmed` | Harus sama dengan input `password_confirmation` |

**Pesan Error Custom:**
Array kedua berisi pesan error dalam Bahasa Indonesia

```php
    $user = User::create([
        'name' => $request->name,
        'email' => $request->email,
        'password' => Hash::make($request->password),
        'role' => 'user'
    ]);
```
**Penjelasan:**
- `User::create()` = Membuat user baru dan simpan ke database
- `Hash::make()` = Mengenkripsi password (tidak disimpan plain text)
- `'role' => 'user'` = Role default adalah user biasa

```php
    Auth::login($user);
    ActivityLog::log('register', 'Mendaftar akun baru');
    return redirect()->route('home');
}
```
**Penjelasan:**
- `Auth::login($user)` = Langsung login tanpa input password lagi
- Catat aktivitas register
- Redirect ke halaman home

---

## Method: logout()

```php
public function logout(Request $request)
{
    ActivityLog::log('logout', 'Keluar dari sistem');
    
    Auth::logout();
    $request->session()->invalidate();
    $request->session()->regenerateToken();
    
    return redirect('/');
}
```

**Penjelasan Baris per Baris:**

| Baris | Penjelasan |
|-------|------------|
| `ActivityLog::log(...)` | Catat aktivitas sebelum logout |
| `Auth::logout()` | Logout user dari sistem |
| `session()->invalidate()` | Hapus semua data session |
| `session()->regenerateToken()` | Buat CSRF token baru |
| `redirect('/')` | Kembali ke halaman utama |

---

# 2. HomeController

File: `app/Http/Controllers/HomeController.php`

```php
<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Produk;
use App\Models\Rating;

class HomeController extends Controller
{
    /**
     * Menampilkan halaman utama dengan semua produk
     */
    public function index()
    {
        // Ambil semua produk, urutkan dari terbaru
        $produks = Produk::latest()->get();
        
        // Kirim ke view welcome.blade.php
        return view('welcome', compact('produks'));
    }

    /**
     * Menampilkan detail satu produk
     */
    public function show($id)
    {
        // Ambil produk beserta rating dan user yang memberi rating
        $produk = Produk::with('ratings.user')->findOrFail($id);
        
        // Hitung rata-rata rating
        $avgRating = $produk->ratings()->avg('rating');
        
        // Kirim ke view produk/show.blade.php
        return view('produk.show', compact('produk', 'avgRating'));
    }
}
```

**Penjelasan Method index():**

| Kode | Penjelasan |
|------|------------|
| `Produk::latest()` | Urutkan berdasarkan created_at DESC (terbaru dulu) |
| `->get()` | Eksekusi query dan ambil semua data |
| `compact('produks')` | Singkatan dari `['produks' => $produks]` |

**Penjelasan Method show($id):**

| Kode | Penjelasan |
|------|------------|
| `$id` | Parameter dari URL, contoh: `/produk/5` maka $id = 5 |
| `with('ratings.user')` | Eager loading: ambil rating + user sekaligus |
| `findOrFail($id)` | Cari berdasarkan ID, jika tidak ada tampilkan 404 |
| `->avg('rating')` | Hitung rata-rata kolom rating |

---

# 3. UserController

File: `app/Http/Controllers/UserController.php`

```php
<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Rating;
use App\Models\Produk;
use App\Models\Transaksi;
use App\Models\ActivityLog;

class UserController extends Controller
{
    /**
     * Dashboard User
     */
    public function index()
    {
        $user = Auth::user();
        
        // Ambil 3 transaksi terbaru
        $transaksis = $user->transaksis()->latest()->take(3)->get();
        
        // Hitung total pengeluaran (hanya yang sudah dibayar)
        $totalPengeluaran = $user->transaksis()
            ->whereIn('status', ['paid', 'completed'])
            ->sum('total_harga');

        return view('user.dashboard', compact('transaksis', 'totalPengeluaran'));
    }
```

**Penjelasan:**

| Kode | Penjelasan |
|------|------------|
| `Auth::user()` | Ambil data user yang sedang login |
| `$user->transaksis()` | Akses relasi hasMany ke Transaksi |
| `->latest()->take(3)` | Urutkan terbaru, ambil 3 saja |
| `->whereIn('status', [...])` | Filter: status harus salah satu dari array |
| `->sum('total_harga')` | Jumlahkan kolom total_harga |

```php
    /**
     * Halaman Log Aktivitas User
     */
    public function activityLog()
    {
        $user = Auth::user();
        $activities = ActivityLog::where('user_id', $user->id)
            ->latest()
            ->get();
            
        return view('user.activity_log', compact('activities'));
    }

    /**
     * Halaman Daftar Pesanan User
     */
    public function pesanan()
    {
        $user = Auth::user();
        $transaksis = $user->transaksis()->with('produk')->latest()->get();
        return view('user.pesanan', compact('transaksis'));
    }
```

**Penjelasan pesanan():**

| Kode | Penjelasan |
|------|------------|
| `$user->transaksis()` | Akses relasi hasMany ke Transaksi |
| `->with('produk')` | Eager loading relasi produk untuk efisiensi |
| `->latest()->get()` | Urutkan terbaru dan ambil semua |

```php
    /**
     * Proses Rating Produk
     */
    public function rate(Request $request)
    {
        // Validasi input
        $request->validate([
            'produk_id' => 'required',
            'rating' => 'required|integer|min:1|max:5',
            'review' => 'nullable|string'
        ]);

        // Ambil data produk untuk log
        $produk = Produk::find($request->produk_id);

        // Simpan rating
        Rating::create([
            'user_id' => Auth::id(),
            'produk_id' => $request->produk_id,
            'rating' => $request->rating,
            'review' => $request->review
        ]);

        // Catat aktivitas
        ActivityLog::log('rating', 'Memberi rating ' . $request->rating . '★ untuk ' . $produk->nama, [
            'produk_id' => $request->produk_id,
            'rating' => $request->rating,
        ]);

        return back()->with('success', 'Terima kasih atas penilaian Anda.');
    }
```

**Penjelasan rate():**
1. Validasi: produk_id wajib, rating 1-5, review opsional
2. Ambil data produk untuk nama di log
3. Simpan rating ke database
4. Catat di activity log dengan metadata
5. Kembali dengan pesan sukses

```php
    /**
     * Form Edit Profil
     */
    public function editProfile()
    {
        $user = Auth::user();
        return view('user.edit_profile', compact('user'));
    }

    /**
     * Proses Update Profil
     */
    public function updateProfile(Request $request)
    {
        $user = Auth::user();

        // Validasi (email unik kecuali milik sendiri)
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,'.$user->id,
            'password' => 'nullable|string|min:8|confirmed',
        ]);

        // Update data
        $user->name = $request->name;
        $user->email = $request->email;

        // Update password hanya jika diisi
        if ($request->filled('password')) {
            $user->password = \Illuminate\Support\Facades\Hash::make($request->password);
        }

        $user->save();

        ActivityLog::log('update_profile', 'Memperbarui profil');

        return redirect()->route('user.dashboard')
            ->with('success', 'Profil berhasil diperbarui.');
    }
}
```

**Penjelasan updateProfile():**

| Kode | Penjelasan |
|------|------------|
| `unique:users,email,'.$user->id` | Email harus unik, KECUALI milik user dengan ID ini |
| `$request->filled('password')` | Cek apakah password diisi (tidak kosong) |
| `$user->save()` | Simpan perubahan ke database |

---

# 4. TransaksiController

File: `app/Http/Controllers/TransaksiController.php`

```php
<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Transaksi;
use App\Models\Produk;
use App\Models\ActivityLog;
use Illuminate\Support\Facades\Auth;
use Barryvdh\DomPDF\Facade\Pdf;

class TransaksiController extends Controller
{
    /**
     * Halaman Checkout
     */
    public function checkout($id)
    {
        $produk = Produk::findOrFail($id);
        return view('transaksi.checkout', compact('produk'));
    }

    /**
     * Proses Pembelian dengan Upload Bukti Pembayaran
     */
    public function store(Request $request)
    {
        $request->validate([
            'produk_id' => 'required|exists:produks,id',
            'kuantitas' => 'required|integer|min:1',
            'payment_method' => 'required|string',
            'game_id' => 'required|string',
            'server_id' => 'required|string',
            'bukti_pembayaran' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
        ], [
            'kuantitas.min' => 'Jumlah minimal 1.',
            'game_id.required' => 'User ID Game wajib diisi.',
            'server_id.required' => 'Server ID wajib diisi.',
            'payment_method.required' => 'Pilih metode pembayaran.',
            'bukti_pembayaran.required' => 'Bukti pembayaran wajib diupload.',
            'bukti_pembayaran.image' => 'File harus berupa gambar.',
            'bukti_pembayaran.max' => 'Ukuran file maksimal 2MB.',
        ]);

        $produk = Produk::findOrFail($request->produk_id);
        
        // Cek ketersediaan stok
        if($produk->stok < $request->kuantitas) {
            return back()->with('error', 'Stok tidak mencukupi');
        }

        // Upload bukti pembayaran
        $buktiPath = null;
        if ($request->hasFile('bukti_pembayaran')) {
            $buktiPath = $request->file('bukti_pembayaran')->store('bukti_pembayaran', 'public');
        }

        // Hitung total harga
        $total_harga = $produk->harga * $request->kuantitas;

        // Buat transaksi
        $transaksi = Transaksi::create([
            'user_id' => Auth::id(),
            'produk_id' => $produk->id,
            'kuantitas' => $request->kuantitas,
            'total_harga' => $total_harga,
            'payment_method' => $request->payment_method,
            'game_id' => $request->game_id,
            'server_id' => $request->server_id,
            'status' => 'pending',
            'bukti_pembayaran' => $buktiPath,
        ]);

        // Kurangi stok produk
        $produk->decrement('stok', $request->kuantitas);

        // Catat aktivitas
        ActivityLog::log('checkout', 'Membeli ' . $produk->nama . ' x' . $request->kuantitas, [
            'transaksi_id' => $transaksi->id,
            'produk_id' => $produk->id,
            'total' => $total_harga,
        ]);

        return redirect()->route('user.dashboard')
            ->with('success', 'Pesanan berhasil dibuat. Admin akan memverifikasi pembayaran Anda.');
    }

    /**
     * Cetak Invoice PDF
     */
    public function printPdf($id)
    {
        $transaksi = Transaksi::with(['user', 'produk'])->findOrFail($id);

        // Cek akses: hanya pemilik transaksi atau admin
        if ($transaksi->user_id !== Auth::id() && Auth::user()->role !== 'admin') {
            abort(403);
        }

        ActivityLog::log('print_invoice', 'Mencetak invoice #' . str_pad($transaksi->id, 5, '0', STR_PAD_LEFT), [
            'transaksi_id' => $transaksi->id,
        ]);

        $pdf = Pdf::loadView('pdf.invoice', compact('transaksi'));
        return $pdf->download('invoice-'.$transaksi->id.'.pdf');
    }
}
```

**Penjelasan store() dengan Bukti Pembayaran:**

| Kode | Penjelasan |
|------|------------|
| `'bukti_pembayaran' => 'required|image|...'` | Validasi file gambar wajib diupload |
| `->store('bukti_pembayaran', 'public')` | Simpan ke folder `storage/app/public/bukti_pembayaran` |
| `$produk->decrement('stok', ...)` | Kurangi stok setelah transaksi dibuat |
| `'status' => 'pending'` | Status awal menunggu konfirmasi admin |

**Validasi Upload File:**

| Aturan | Penjelasan |
|--------|------------|
| `required` | Wajib diupload |
| `image` | Harus berupa gambar |
| `mimes:jpeg,png,jpg,gif,webp` | Format yang diizinkan |
| `max:2048` | Maksimal 2MB (dalam KB) |

---

# 5. AdminController

File: `app/Http/Controllers/AdminController.php`

```php
<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Produk;
use App\Models\Transaksi;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class AdminController extends Controller
{
    /**
     * Dashboard Admin - Menampilkan Statistik
     */
    public function index()
    {
        // Total pendapatan dari transaksi yang sudah dibayar
        $totalStoreRevenue = Transaksi::whereIn('status', ['paid', 'completed'])
            ->sum('total_harga');
        
        // Hitung jumlah produk
        $totalProduk = Produk::count();
        
        // Hitung jumlah user (bukan admin)
        $totalUsers = User::where('role', 'user')->count();
        
        // Hitung transaksi pending
        $pendingCount = Transaksi::where('status', 'pending')->count();
        
        return view('admin.dashboard', compact(
            'totalStoreRevenue', 
            'totalProduk', 
            'totalUsers', 
            'pendingCount'
        ));
    }
```

```php
    /**
     * Halaman Daftar Produk
     */
    public function produkIndex()
    {
        $produks = Produk::latest()->get();
        return view('admin.produk', compact('produks'));
    }

    /**
     * Halaman Daftar User
     */
    public function usersIndex()
    {
        $users = User::latest()->get();
        return view('admin.users', compact('users'));
    }

    /**
     * Halaman Pembayaran Pending
     */
    public function pembayaranIndex()
    {
        $pendingTransactions = Transaksi::where('status', 'pending')
            ->with(['user', 'produk'])  // Eager load relasi
            ->latest()
            ->get();
            
        return view('admin.pembayaran', compact('pendingTransactions'));
    }

    /**
     * Halaman Log Aktivitas Semua User
     */
    public function logIndex()
    {
        $activities = \App\Models\ActivityLog::with('user')
            ->latest()
            ->get();
            
        return view('admin.log', compact('activities'));
    }
```

```php
    /**
     * Konfirmasi atau Tolak Pembayaran
     */
    public function confirmPayment($id, $status)
    {
        $transaksi = Transaksi::findOrFail($id);
        
        if ($status == 'paid') {
            // KONFIRMASI: Update status menjadi paid
            $transaksi->update(['status' => 'paid']);
            
            // Catat aktivitas
            \App\Models\ActivityLog::log(
                'confirm_payment', 
                'Mengkonfirmasi pembayaran #' . str_pad($transaksi->id, 5, '0', STR_PAD_LEFT),
                [
                    'transaksi_id' => $transaksi->id,
                    'user_name' => $transaksi->user->name,
                ]
            );
            
            return back()->with('success', 'Pembayaran dikonfirmasi.');
        } else {
            // TOLAK: Update status menjadi cancelled
            $transaksi->update(['status' => 'cancelled']);
            
            // Kembalikan stok produk
            $transaksi->produk->increment('stok', $transaksi->kuantitas);
            
            // Catat aktivitas
            \App\Models\ActivityLog::log(
                'reject_payment', 
                'Menolak pembayaran #' . str_pad($transaksi->id, 5, '0', STR_PAD_LEFT),
                [
                    'transaksi_id' => $transaksi->id,
                    'user_name' => $transaksi->user->name,
                ]
            );
            
            return back()->with('success', 'Transaksi dibatalkan.');
        }
    }
```

**Penjelasan confirmPayment():**

| Kode | Penjelasan |
|------|------------|
| `$transaksi->update(['status' => 'paid'])` | Update kolom status |
| `str_pad($id, 5, '0', STR_PAD_LEFT)` | Format ID jadi 5 digit (00001) |
| `->increment('stok', $kuantitas)` | Tambahkan stok kembali |

```php
    /**
     * Tambah Produk Baru
     */
    public function storeProduk(Request $request)
    {
        $request->validate([
            'nama' => 'required|string|max:255',
            'deskripsi' => 'required|string',
            'harga' => 'required|numeric|min:1',
            'stok' => 'required|integer|min:1',
            'gambar' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
        ]);

        // Upload gambar
        $imagePath = null;
        if ($request->hasFile('gambar')) {
            $imagePath = $request->file('gambar')->store('produk_images', 'public');
        }

        // Buat produk
        $produk = Produk::create([
            'nama' => $request->nama,
            'deskripsi' => $request->deskripsi,
            'harga' => $request->harga,
            'stok' => $request->stok,
            'lokasi_gambar' => $imagePath,
            'user_id' => Auth::id(),
        ]);

        // Catat aktivitas
        \App\Models\ActivityLog::log('add_product', 'Menambahkan produk: ' . $produk->nama);

        return back()->with('success', 'Produk berhasil ditambahkan.');
    }
```

**Penjelasan Upload Gambar:**

| Kode | Penjelasan |
|------|------------|
| `$request->hasFile('gambar')` | Cek apakah ada file diupload |
| `$request->file('gambar')` | Ambil file yang diupload |
| `->store('produk_images', 'public')` | Simpan di folder `storage/app/public/produk_images` |
| Return: `produk_images/namafile.jpg` | Path relatif |

```php
    /**
     * Hapus Produk
     */
    public function destroyProduk($id)
    {
        $produk = Produk::findOrFail($id);
        $produkNama = $produk->nama;  // Simpan nama sebelum dihapus
        $produk->delete();
        
        \App\Models\ActivityLog::log('delete_product', 'Menghapus produk: ' . $produkNama);
        
        return back()->with('success', 'Produk berhasil dihapus.');
    }

    /**
     * Hapus User
     */
    public function destroyUser($id)
    {
        $user = User::findOrFail($id);
        $userName = $user->name;
        $user->delete();
        
        \App\Models\ActivityLog::log('delete_user', 'Menghapus user: ' . $userName);
        
        return back()->with('success', 'User berhasil dihapus.');
    }

    /**
     * Tambah Admin Baru
     */
    public function storeAdmin(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
        ]);

        $newAdmin = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => \Illuminate\Support\Facades\Hash::make($request->password),
            'role' => 'admin',  // Role = admin
        ]);

        \App\Models\ActivityLog::log('add_admin', 'Menambahkan admin baru: ' . $newAdmin->name);

        return back()->with('success', 'Admin baru berhasil ditambahkan.');
    }
```

```php
    /**
     * Form Edit Produk
     */
    public function editProduk($id)
    {
        $produk = Produk::findOrFail($id);
        return view('admin.edit_produk', compact('produk'));
    }

    /**
     * Proses Update Produk
     */
    public function updateProduk(Request $request, $id)
    {
        $request->validate([
            'nama' => 'required|string|max:255',
            'deskripsi' => 'required|string',
            'harga' => 'required|numeric|min:1',
            'stok' => 'required|integer|min:0',
            'gambar' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
        ]);

        $produk = Produk::findOrFail($id);

        $data = [
            'nama' => $request->nama,
            'deskripsi' => $request->deskripsi,
            'harga' => $request->harga,
            'stok' => $request->stok,
        ];

        // Jika ada gambar baru, upload dan hapus yang lama
        if ($request->hasFile('gambar')) {
            // Hapus gambar lama
            if ($produk->lokasi_gambar && Storage::disk('public')->exists($produk->lokasi_gambar)) {
                Storage::disk('public')->delete($produk->lokasi_gambar);
            }
            // Upload gambar baru
            $data['lokasi_gambar'] = $request->file('gambar')->store('produk_images', 'public');
        }

        $produk->update($data);

        \App\Models\ActivityLog::log('edit_product', 'Mengedit produk: ' . $produk->nama);

        return redirect()->route('admin.dashboard')
            ->with('success', 'Produk berhasil diperbarui.');
    }

    /**
     * Laporan Keuangan dengan Filter Tanggal/Bulan/Tahun
     */
    public function laporanKeuangan(Request $request)
    {
        // Date Range Filter
        $startDate = $request->get('start_date');
        $endDate = $request->get('end_date');

        // Month/Year Filters
        $bulan = $request->get('bulan', now()->month);
        $tahun = $request->get('tahun', now()->year);

        // Query dengan filter
        $query = Transaksi::whereIn('status', ['paid', 'completed'])
            ->with(['user', 'produk'])
            ->latest();

        // Apply filter berdasarkan rentang tanggal atau bulan/tahun
        if ($startDate && $endDate) {
            $query->whereDate('created_at', '>=', $startDate)
                  ->whereDate('created_at', '<=', $endDate);
        } else {
            $query->whereYear('created_at', $tahun);
            if ($bulan != 'all') {
                $query->whereMonth('created_at', $bulan);
            }
        }

        $transaksis = $query->get();

        // Hitung total
        $totalPendapatan = $transaksis->sum('total_harga');
        $totalTransaksi = $transaksis->count();

        // Breakdown per produk (produk terlaris)
        $produkBreakdown = $transaksis->groupBy('produk_id')->map(function ($items) {
            $produk = $items->first()->produk;
            return [
                'nama' => $produk ? $produk->nama : 'Produk Dihapus',
                'jumlah_terjual' => $items->sum('kuantitas'),
                'total_pendapatan' => $items->sum('total_harga'),
            ];
        })->sortByDesc('total_pendapatan')->values();

        return view('admin.laporan', compact(
            'transaksis', 'totalPendapatan', 'totalTransaksi', 
            'produkBreakdown', 'bulan', 'tahun'
        ));
    }
}
```

**Penjelasan laporanKeuangan():**

| Kode | Penjelasan |
|------|------------|
| `$request->get('bulan', now()->month)` | Ambil parameter bulan, default bulan ini |
| `whereIn('status', ['paid', 'completed'])` | Filter hanya transaksi yang sudah bayar |
| `whereDate('created_at', '>=', $startDate)` | Filter berdasarkan rentang tanggal |
| `whereYear()` / `whereMonth()` | Filter berdasarkan tahun/bulan |
| `$transaksis->groupBy('produk_id')` | Grouping untuk breakdown per produk |
| `->sortByDesc('total_pendapatan')` | Urutkan produk dari pendapatan tertinggi |

**Filter yang Tersedia:**

| Filter | Cara Kerja |
|--------|------------|
| Rentang Tanggal | Parameter `start_date` dan `end_date` |
| Bulan Tertentu | Parameter `bulan` (1-12) |
| Tahun Tertentu | Parameter `tahun` |
| Semua Bulan | `bulan=all` untuk melihat seluruh tahun |

**Penjelasan Update Gambar:**
1. Cek apakah ada file baru diupload
2. Jika ada, hapus file lama dari storage
3. Upload file baru
4. Update path di database

---

## RINGKASAN SEMUA METHOD

| Controller | Method | Fungsi |
|------------|--------|--------|
| **AuthController** | showLogin() | Tampilkan form login |
| | login() | Proses login |
| | showRegister() | Tampilkan form register |
| | register() | Proses register |
| | logout() | Proses logout |
| **HomeController** | index() | Halaman home |
| | show($id) | Detail produk |
| **UserController** | index() | Dashboard user |
| | activityLog() | Log aktivitas user |
| | pesanan() | Daftar pesanan user |
| | rate() | Kirim rating |
| | editProfile() | Form edit profil |
| | updateProfile() | Proses update profil |
| **TransaksiController** | checkout($id) | Form checkout |
| | store() | Proses pembelian + bukti bayar |
| | printPdf($id) | Cetak invoice |
| **AdminController** | index() | Dashboard admin |
| | produkIndex() | Daftar produk |
| | usersIndex() | Daftar user |
| | pembayaranIndex() | Daftar pending |
| | logIndex() | Log semua aktivitas |
| | laporanKeuangan() | Laporan keuangan |
| | confirmPayment() | Konfirmasi/tolak bayar |
| | storeProduk() | Tambah produk |
| | destroyProduk() | Hapus produk |
| | destroyUser() | Hapus user |
| | storeAdmin() | Tambah admin |
| | editProduk() | Form edit produk |
| | updateProduk() | Proses update produk |
