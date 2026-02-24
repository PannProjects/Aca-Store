<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Produk;
use App\Models\Transaksi;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class AdminController extends Controller
{
    public function index()
    {
        $totalStoreRevenue = Transaksi::whereIn('status', ['paid', 'completed'])->sum('total_harga');
        $totalProduk = Produk::count();
        $totalUsers = User::where('role', 'user')->count();
        $pendingCount = Transaksi::where('status', 'pending')->count();
        
        return Inertia::render('Admin/Dashboard', [
            'totalStoreRevenue' => $totalStoreRevenue,
            'totalProduk' => $totalProduk,
            'totalUsers' => $totalUsers,
            'pendingCount' => $pendingCount,
        ]);
    }

    public function produkIndex()
    {
        $produks = Produk::latest()->get();
        return Inertia::render('Admin/Produk', [
            'produks' => $produks,
        ]);
    }

    public function usersIndex()
    {
        $users = User::latest()->get();
        return Inertia::render('Admin/Users', [
            'users' => $users,
        ]);
    }

    public function pembayaranIndex()
    {
        $pendingTransactions = Transaksi::where('status', 'pending')->with(['user', 'produk'])->latest()->get();
        return Inertia::render('Admin/Pembayaran', [
            'pendingTransactions' => $pendingTransactions,
        ]);
    }

    public function logIndex()
    {
        $activities = \App\Models\ActivityLog::with('user')->latest()->get();
        return Inertia::render('Admin/Log', [
            'activities' => $activities,
        ]);
    }

    public function confirmPayment($id, $status)
    {
        $transaksi = Transaksi::findOrFail($id);
        
        if ($status !== 'paid') {
            abort(400, 'Hanya status PAID yang diizinkan melalui rute ini.');
        }

        $transaksi->update(['status' => 'paid']);
        
        // Log Activity
        \App\Models\ActivityLog::log('confirm_payment', 'Mengkonfirmasi pembayaran #' . str_pad($transaksi->id, 5, '0', STR_PAD_LEFT), [
            'transaksi_id' => $transaksi->id,
            'user_name' => $transaksi->user->name,
        ]);

        // Send Notification
        \App\Models\Notification::send(
            $transaksi->user_id,
            'payment_confirmed',
            'Pembayaran Diterima ✅',
            'Pembayaran untuk pesanan #' . str_pad($transaksi->id, 5, '0', STR_PAD_LEFT) . ' telah diverifikasi admin.',
            ['transaksi_id' => $transaksi->id]
        );

        return back()->with('success', 'Pembayaran dikonfirmasi.');
    }

    public function rejectPayment(Request $request, $id)
    {
        $request->validate([
            'alasan_penolakan' => 'required|string|max:1000'
        ], [
            'alasan_penolakan.required' => 'Alasan penolakan wajib diisi.'
        ]);

        $transaksi = Transaksi::findOrFail($id);
        $transaksi->update([
            'status' => 'failed',
            'alasan_penolakan' => $request->alasan_penolakan
        ]);
        
        $transaksi->produk->increment('stok', $transaksi->kuantitas);
        
        \App\Models\ActivityLog::log('reject_payment', 'Menolak pembayaran #' . str_pad($transaksi->id, 5, '0', STR_PAD_LEFT), [
            'transaksi_id' => $transaksi->id,
            'user_name' => $transaksi->user->name,
        ]);

        \App\Models\Notification::send(
            $transaksi->user_id,
            'payment_rejected',
            'Pembayaran Ditolak ❌',
            'Pesanan #' . str_pad($transaksi->id, 5, '0', STR_PAD_LEFT) . ' dibatalkan. Alasan: ' . $request->alasan_penolakan,
            ['transaksi_id' => $transaksi->id]
        );

        return back()->with('success', 'Transaksi berhasil ditolak dan stok dikembalikan.');
    }

    public function storeProduk(Request $request)
    {
        $request->validate([
            'nama' => 'required|string|max:255',
            'deskripsi' => 'required|string',
            'harga' => 'required|numeric|min:1',
            'stok' => 'required|integer|min:1',
            'gambar' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'kategori_input' => 'required|in:id_server,catatan',
            'is_active' => 'boolean',
        ], [
            'harga.min' => 'Harga harus lebih dari 0.',
            'stok.min' => 'Stok minimal 1.',
            'kategori_input.in' => 'Kategori input tidak valid.',
        ]);

        if ($request->hasFile('gambar')) {
            try {
                $disk = config('filesystems.default');
                $imagePath = $request->file('gambar')->store('produk_images', $disk);
            } catch (\Exception $e) {
                Log::error('Upload failed: ' . $e->getMessage());
                return back()->withErrors(['gambar' => 'Upload failed: ' . $e->getMessage()]);
            }
        }

        $produk = Produk::create([
            'nama' => $request->nama,
            'deskripsi' => $request->deskripsi,
            'harga' => $request->harga,
            'stok' => $request->stok,
            'lokasi_gambar' => $imagePath,
            'kategori_input' => $request->kategori_input,
            'is_active' => $request->boolean('is_active', true),
            'user_id' => Auth::id(),
        ]);

        \App\Models\ActivityLog::log('add_product', 'Menambahkan produk: ' . $produk->nama, [
            'produk_id' => $produk->id,
        ]);

        return back()->with('success', 'Produk berhasil ditambahkan.');
    }

    public function destroyProduk($id)
    {
        $produk = Produk::findOrFail($id);
        $produkNama = $produk->nama;
        
        $disk = config('filesystems.default');
        if ($produk->lokasi_gambar && Storage::disk($disk)->exists($produk->lokasi_gambar)) {
            Storage::disk($disk)->delete($produk->lokasi_gambar);
        }

        $produk->delete();
        
        \App\Models\ActivityLog::log('delete_product', 'Menghapus produk: ' . $produkNama, [
            'produk_id' => $id,
        ]);
        
        return back()->with('success', 'Produk berhasil dihapus.');
    }

    public function destroyUser($id)
    {
        $user = User::findOrFail($id);
        $userName = $user->name;
        $user->delete();
        
        \App\Models\ActivityLog::log('delete_user', 'Menghapus user: ' . $userName, [
            'user_id' => $id,
        ]);
        
        return back()->with('success', 'User berhasil dihapus.');
    }

    public function storeAdmin(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
        ], [
            'password.min' => 'Password minimal 8 karakter.',
            'email.unique' => 'Email sudah terdaftar.',
        ]);

        $newAdmin = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => \Illuminate\Support\Facades\Hash::make($request->password),
            'role' => 'admin',
        ]);

        \App\Models\ActivityLog::log('add_admin', 'Menambahkan admin baru: ' . $newAdmin->name, [
            'admin_id' => $newAdmin->id,
        ]);

        return back()->with('success', 'Admin baru berhasil ditambahkan.');
    }

    public function editProduk($id)
    {
        $produk = Produk::findOrFail($id);
        return Inertia::render('Admin/EditProduk', [
            'produk' => $produk,
        ]);
    }

    public function updateProduk(Request $request, $id)
    {
        $request->validate([
            'nama' => 'required|string|max:255',
            'deskripsi' => 'required|string',
            'harga' => 'required|numeric|min:1',
            'stok' => 'required|integer|min:0',
            'gambar' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'kategori_input' => 'required|in:id_server,catatan',
            'is_active' => 'boolean',
        ], [
            'harga.min' => 'Harga harus lebih dari 0.',
            'stok.min' => 'Stok tidak boleh minus.',
            'kategori_input.in' => 'Kategori input tidak valid.',
        ]);

        $produk = Produk::findOrFail($id);

        $data = [
            'nama' => $request->nama,
            'deskripsi' => $request->deskripsi,
            'harga' => $request->harga,
            'stok' => $request->stok,
            'kategori_input' => $request->kategori_input,
            'is_active' => $request->boolean('is_active'),
        ];

        if ($request->hasFile('gambar')) {
            $disk = config('filesystems.default');
            if ($produk->lokasi_gambar && Storage::disk($disk)->exists($produk->lokasi_gambar)) {
                Storage::disk($disk)->delete($produk->lokasi_gambar);
            }
            $data['lokasi_gambar'] = $request->file('gambar')->store('produk_images', $disk);
        }

        $produk->update($data);

        \App\Models\ActivityLog::log('edit_product', 'Mengedit produk: ' . $produk->nama, [
            'produk_id' => $produk->id,
        ]);

        return redirect()->route('admin.dashboard')->with('success', 'Produk berhasil diperbarui.');
    }

    public function laporanKeuangan(Request $request)
    {
        $startDate = $request->get('start_date');
        $endDate = $request->get('end_date');
        $bulan = $request->get('bulan', now()->month);
        $tahun = $request->get('tahun', now()->year);

        $namaBulan = [
            1 => 'Januari', 2 => 'Februari', 3 => 'Maret', 4 => 'April',
            5 => 'Mei', 6 => 'Juni', 7 => 'Juli', 8 => 'Agustus',
            9 => 'September', 10 => 'Oktober', 11 => 'November', 12 => 'Desember'
        ];

        $query = Transaksi::whereIn('status', ['paid', 'completed'])
            ->with(['user', 'produk'])
            ->latest();

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
        $totalPendapatan = $transaksis->sum('total_harga');
        $totalTransaksi = $transaksis->count();

        $produkBreakdown = $transaksis->groupBy('produk_id')->map(function ($items) {
            $produk = $items->first()->produk;
            return [
                'nama' => $produk ? $produk->nama : 'Produk Dihapus',
                'jumlah_terjual' => $items->sum('kuantitas'),
                'total_pendapatan' => $items->sum('total_harga'),
            ];
        })->sortByDesc('total_pendapatan')->values();

        $monthlyBreakdown = [];
        if ($bulan == 'all') {
            foreach ($namaBulan as $key => $val) {
                $monthlyBreakdown[$key] = [
                    'nama_bulan' => $val,
                    'total_pendapatan' => 0,
                    'jumlah_transaksi' => 0
                ];
            }

            $grouped = $transaksis->groupBy(function($date) {
                return $date->created_at->format('n');
            });

            foreach ($grouped as $monthNum => $items) {
                $monthlyBreakdown[$monthNum]['total_pendapatan'] = $items->sum('total_harga');
                $monthlyBreakdown[$monthNum]['jumlah_transaksi'] = $items->count();
            }
        }

        $firstTransaction = Transaksi::oldest()->first();
        $startYear = $firstTransaction ? $firstTransaction->created_at->year : now()->year;
        $years = range($startYear, now()->year);

        return Inertia::render('Admin/Laporan', [
            'transaksis' => $transaksis,
            'totalPendapatan' => $totalPendapatan,
            'totalTransaksi' => $totalTransaksi,
            'produkBreakdown' => $produkBreakdown,
            'bulan' => $bulan,
            'tahun' => $tahun,
            'years' => $years,
            'namaBulan' => $namaBulan,
            'monthlyBreakdown' => $monthlyBreakdown,
            'startDate' => $startDate,
            'endDate' => $endDate,
        ]);
    }
}
