# 📚 BAB 6: VIEW & BLADE TEMPLATE

## 6.1 Apa itu View?

View adalah file HTML yang menampilkan data ke user.

Di Laravel, view menggunakan **Blade Template Engine** yang memudahkan kita menulis HTML dinamis.

File view ada di: `resources/views/`

---

## 6.2 Sintaks Blade

### Menampilkan Variabel
```html
{{ $nama }}          → Menampilkan variabel (auto-escape HTML)
{!! $html !!}        → Menampilkan tanpa escape (hati-hati XSS)
```

### Kondisi If
```html
@if ($kondisi)
    <p>Benar</p>
@elseif ($kondisi2)
    <p>Kondisi 2</p>
@else
    <p>Salah</p>
@endif
```

### Perulangan
```html
@foreach ($produks as $produk)
    <p>{{ $produk->nama }}</p>
@endforeach

@forelse ($items as $item)
    <p>{{ $item }}</p>
@empty
    <p>Tidak ada data</p>
@endforelse
```

### Include & Extend
```html
@extends('layouts.app')    → Menggunakan layout induk
@section('content')        → Mendefinisikan bagian
@yield('content')          → Menampilkan bagian dari child
@include('partials.navbar') → Menyertakan file lain
```

---

## 6.3 Layout Utama

File: `resources/views/layouts/app.blade.php`

```html
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>BerkahStore - Topup Game Amanah</title>
    
    <!-- Tailwind CSS dari CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
    
    <!-- Konfigurasi Tailwind -->
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        primary: '#0f766e',   // Hijau teal
                        secondary: '#14b8a6', // Teal lebih terang
                        accent: '#f59e0b',    // Kuning/Orange
                    }
                }
            }
        }
    </script>
    
    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        * { font-family: 'Inter', sans-serif; }
    </style>
</head>

<body class="bg-gray-50 min-h-screen flex flex-col">

    <!-- NAVBAR -->
    <nav class="bg-primary text-white sticky top-0 z-50 shadow-lg">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center h-16">
                
                <!-- Logo -->
                <a href="{{ route('home') }}" class="text-xl font-bold">
                    Berkah<span class="text-accent">Store</span>
                </a>
                
                <!-- Menu -->
                <div class="flex items-center gap-6">
                    <a href="{{ route('home') }}" class="text-sm hover:text-accent">Beranda</a>
                    
                    @auth
                        <!-- Menu untuk user yang login -->
                        @if (Auth::user()->role == 'admin')
                            <a href="{{ route('admin.dashboard') }}">Dashboard</a>
                            <a href="{{ route('admin.produk.index') }}">Produk</a>
                            <a href="{{ route('admin.users.index') }}">Users</a>
                            <a href="{{ route('admin.pembayaran') }}">Pembayaran</a>
                            <a href="{{ route('admin.log') }}">Log</a>
                        @else
                            <a href="{{ route('user.dashboard') }}">Dashboard</a>
                            <a href="{{ route('user.activity_log') }}">Pesanan</a>
                        @endif
                        
                        <!-- Tombol Logout -->
                        <form action="{{ route('logout') }}" method="POST" class="inline">
                            @csrf
                            <button type="submit" class="hover:text-red-300">Keluar</button>
                        </form>
                    @else
                        <!-- Menu untuk guest -->
                        <a href="{{ route('login') }}">Masuk</a>
                        <a href="{{ route('register') }}" class="bg-accent text-gray-900 px-4 py-2 rounded-lg font-semibold">
                            Daftar
                        </a>
                    @endauth
                </div>
            </div>
        </div>
    </nav>

    <!-- MAIN CONTENT -->
    <main class="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        
        <!-- Flash Messages -->
        @if (session('success'))
            <div class="bg-green-100 border border-green-300 text-green-800 px-4 py-3 rounded-lg mb-6">
                {{ session('success') }}
            </div>
        @endif
        
        @if (session('error'))
            <div class="bg-red-100 border border-red-300 text-red-800 px-4 py-3 rounded-lg mb-6">
                {{ session('error') }}
            </div>
        @endif
        
        @if ($errors->any())
            <div class="bg-red-100 border border-red-300 text-red-800 px-4 py-3 rounded-lg mb-6">
                <ul class="list-disc list-inside">
                    @foreach ($errors->all() as $error)
                        <li>{{ $error }}</li>
                    @endforeach
                </ul>
            </div>
        @endif

        <!-- Konten dari child view -->
        @yield('content')
    </main>
    
</body>
</html>
```

---

## 6.4 Halaman Home (Welcome)

File: `resources/views/welcome.blade.php`

```html
@extends('layouts.app')

@section('content')
<!-- Hero Section -->
<div class="text-center py-12 mb-8">
    <h1 class="text-4xl font-bold text-gray-800 mb-4">
        Selamat Datang di Berkah<span class="text-accent">Store</span>
    </h1>
    <p class="text-gray-500 text-lg">Topup Game Termurah, Terpercaya, dan Amanah.</p>
</div>

<!-- Products Grid -->
<h2 class="text-xl font-bold text-gray-800 mb-6">Produk Terbaru</h2>

<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
    @foreach($produks as $produk)
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition group">
        
        <!-- Gambar Produk -->
        <div class="h-48 bg-gray-100 overflow-hidden">
            @if($produk->lokasi_gambar)
                <img src="{{ asset('storage/' . $produk->lokasi_gambar) }}" 
                     alt="{{ $produk->nama }}" 
                     class="w-full h-full object-cover group-hover:scale-105 transition">
            @else
                <div class="w-full h-full flex items-center justify-center text-gray-400">
                    No Image
                </div>
            @endif
        </div>
        
        <!-- Info Produk -->
        <div class="p-5">
            <h3 class="font-semibold text-gray-800 mb-2">{{ $produk->nama }}</h3>
            <p class="text-teal-600 font-bold text-lg mb-3">
                Rp {{ number_format($produk->harga, 0, ',', '.') }}
            </p>
            <p class="text-gray-500 text-sm mb-4 line-clamp-2">
                {{ Str::limit($produk->deskripsi, 60) }}
            </p>
            <a href="{{ route('produk.show', $produk->id) }}" 
               class="block text-center bg-teal-600 text-white py-2 rounded-lg hover:bg-teal-700 transition font-medium">
                Lihat Detail
            </a>
        </div>
    </div>
    @endforeach
</div>
@endsection
```

---

## 6.5 Halaman Login

File: `resources/views/auth/login.blade.php`

```html
@extends('layouts.app')

@section('content')
<div class="max-w-md mx-auto mt-20 bg-white rounded-xl shadow-lg p-8">
    <h2 class="text-2xl font-bold text-gray-800 mb-6 text-center">Masuk</h2>
    
    <form action="{{ route('login') }}" method="POST">
        @csrf  <!-- Token keamanan CSRF -->
        
        <div class="mb-4">
            <label class="block text-gray-700 mb-2">Email</label>
            <input type="email" name="email" value="{{ old('email') }}"
                   class="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500"
                   placeholder="email@contoh.com" required>
        </div>
        
        <div class="mb-6">
            <label class="block text-gray-700 mb-2">Password</label>
            <input type="password" name="password"
                   class="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500"
                   placeholder="Masukkan password" required>
        </div>
        
        <button type="submit" 
                class="w-full bg-teal-600 text-white py-3 rounded-lg font-semibold hover:bg-teal-700">
            Masuk
        </button>
    </form>
    
    <p class="text-center mt-4 text-gray-600">
        Belum punya akun? 
        <a href="{{ route('register') }}" class="text-teal-600 hover:underline">Daftar</a>
    </p>
</div>
@endsection
```

---

## 6.6 Tips Blade

### CSRF Token
Setiap form POST harus ada `@csrf`:
```html
<form method="POST">
    @csrf  <!-- WAJIB! -->
</form>
```

### Method Spoofing
Untuk PUT/DELETE (karena HTML form hanya support GET/POST):
```html
<form method="POST">
    @csrf
    @method('PUT')    <!-- Atau @method('DELETE') -->
</form>
```

### Old Input
Menampilkan input sebelumnya setelah validasi gagal:
```html
<input name="email" value="{{ old('email') }}">
```

### Format Angka
```html
Rp {{ number_format($harga, 0, ',', '.') }}
<!-- Output: Rp 25.000 -->
```

### Upload File dengan Preview
```html
<form method="POST" enctype="multipart/form-data">
    @csrf
    <input type="file" name="bukti_pembayaran" accept="image/*"
           onchange="previewImage(this)">
    <img id="preview" class="hidden">
</form>

<script>
function previewImage(input) {
    const preview = document.getElementById('preview');
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = e => {
            preview.src = e.target.result;
            preview.classList.remove('hidden');
        }
        reader.readAsDataURL(input.files[0]);
    }
}
</script>
```

**Penjelasan:**
- `enctype="multipart/form-data"` - WAJIB untuk upload file
- `accept="image/*"` - Hanya menerima file gambar
- `FileReader` - Untuk menampilkan preview sebelum upload

---

## 6.7 Halaman Baru yang Ditambahkan

### Halaman Checkout (dengan Bukti Pembayaran)
File: `resources/views/transaksi/checkout.blade.php`

Fitur:
- Form pembelian dengan validasi
- Input User ID Game dan Server ID
- Upload bukti pembayaran dengan preview
- Kalkulasi total harga otomatis

### Halaman Pesanan User
File: `resources/views/user/pesanan.blade.php`

Fitur:
- Daftar semua pesanan user
- Badge status (Menunggu, Dikonfirmasi, Ditolak)
- Tombol cetak invoice (hanya jika sudah dikonfirmasi)
- Empty state jika belum ada pesanan

### Halaman Laporan Keuangan Admin
File: `resources/views/admin/laporan.blade.php`

Fitur:
- Filter bulan/tahun atau rentang tanggal
- Kartu statistik (Total Pendapatan, Jumlah Transaksi, Rata-rata)
- Tabel rincian bulanan (jika memilih "Semua Bulan")
- Breakdown produk terlaris
- Daftar transaksi dengan pagination

---

> 📖 **Lanjut ke:** [PANDUAN_07_FITUR.md](./PANDUAN_07_FITUR.md)
