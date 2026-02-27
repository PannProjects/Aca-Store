<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Transaksi;
use App\Models\Produk;
use App\Models\ActivityLog;
use Illuminate\Support\Facades\Auth;
use Barryvdh\DomPDF\Facade\Pdf;
use Inertia\Inertia;

class TransaksiController extends Controller
{
    public function checkout($id)
    {
        $produk = Produk::findOrFail($id);

        if (!$produk->is_active) {
            return redirect()->route('home')->with('error', 'Produk sedang dalam maintenance.');
        }

        return Inertia::render('Transaksi/Checkout', [
            'produk' => $produk,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'produk_id' => 'required|exists:produks,id',
            'kuantitas' => 'required|integer|min:1|max:' . (Produk::find($request->produk_id)?->stok ?? 0),
            'payment_method' => 'required|string',
            'bukti_pembayaran' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
        ], [
            'kuantitas.min' => 'Jumlah minimal 1.',
            'payment_method.required' => 'Pilih metode pembayaran.',
            'bukti_pembayaran.required' => 'Bukti pembayaran wajib diupload.',
            'bukti_pembayaran.image' => 'File harus berupa gambar.',
            'bukti_pembayaran.max' => 'Ukuran file maksimal 2MB.',
        ]);

        $produk = Produk::findOrFail($request->produk_id);

        if ($produk->kategori_input === 'id_server') {
            $request->validate([
                'game_id' => 'required|string',
                'server_id' => 'required|string',
                'catatan' => 'nullable|string',
            ], [
                'game_id.required' => 'User ID Game wajib diisi.',
                'server_id.required' => 'Server ID wajib diisi.',
            ]);
        } else {
            $request->validate([
                'catatan' => 'required|string',
            ], [
                'catatan.required' => 'Catatan wajib diisi.',
            ]);
        }

        $buktiPath = null;
        if ($request->hasFile('bukti_pembayaran')) {
            $disk = config('filesystems.default');
            $buktiPath = $request->file('bukti_pembayaran')->store('bukti_pembayaran', $disk);
        }

        $total_harga = $produk->harga * $request->kuantitas;

        // Gunakan DB transaction dengan lockForUpdate untuk mencegah race condition pada stok
        try {
            $transaksi = \Illuminate\Support\Facades\DB::transaction(function () use ($request, $produk, $total_harga, $buktiPath) {
                // Lock row produk untuk mencegah concurrent reads
                $lockedProduk = Produk::lockForUpdate()->find($produk->id);

                if ($lockedProduk->stok < $request->kuantitas) {
                    throw new \Exception('Stok tidak mencukupi');
                }

                $lockedProduk->decrement('stok', $request->kuantitas);

                return Transaksi::create([
                    'user_id' => Auth::id(),
                    'produk_id' => $lockedProduk->id,
                    'kuantitas' => $request->kuantitas,
                    'total_harga' => $total_harga,
                    'payment_method' => $request->payment_method,
                    'game_id' => $lockedProduk->kategori_input === 'id_server' ? $request->game_id : null,
                    'server_id' => $lockedProduk->kategori_input === 'id_server' ? $request->server_id : null,
                    'catatan' => $request->catatan,
                    'status' => 'pending',
                    'bukti_pembayaran' => $buktiPath,
                ]);
            });
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }

        ActivityLog::log('checkout', 'Membeli ' . $produk->nama . ' x' . $request->kuantitas, [
            'transaksi_id' => $transaksi->id,
            'produk_id' => $produk->id,
            'total' => $total_harga,
        ]);

        $waAdmin = config('services.acastore.wa_admin_number', '6281234567890');
        $detailAkun = $produk->kategori_input === 'id_server' ? "ID: {$request->game_id} Server: {$request->server_id}" : "Catatan: {$request->catatan}";
        $text = "Halo Admin AcaStore!\n\nSaya baru saja membuat pesanan:\n- Produk: {$produk->nama}\n- Qty: {$request->kuantitas}\n- {$detailAkun}\n- Total Tagihan: Rp " . number_format($total_harga, 0, ',', '.') . "\n- Metode: " . strtoupper($request->payment_method) . "\n\nMohon segera diproses ya min! Bukti transfer sudah saya upload di sistem.";
        $waUrl = "https://api.whatsapp.com/send?phone={$waAdmin}&text=" . urlencode($text);

        return redirect()->route('user.pesanan')->with('success', 'Pesanan berhasil dibuat. Admin akan memverifikasi pembayaran Anda.')->with('whatsapp_url', $waUrl);
    }

    public function printPdf($id)
    {
        $transaksi = Transaksi::with(['user', 'produk'])->findOrFail($id);

        if ($transaksi->user_id !== Auth::id() && Auth::user()->role !== 'admin') {
            abort(403);
        }

        ActivityLog::log('print_invoice', 'Mencetak invoice #' . str_pad($transaksi->id, 5, '0', STR_PAD_LEFT), [
            'transaksi_id' => $transaksi->id,
        ]);

        return Inertia::render('Transaksi/Invoice', [
            'transaksi' => $transaksi
        ]);
    }
}
