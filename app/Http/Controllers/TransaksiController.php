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
        return Inertia::render('Transaksi/Checkout', [
            'produk' => $produk,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'produk_id' => 'required|exists:produks,id',
            'kuantitas' => 'required|integer|min:1',
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

        if($produk->stok < $request->kuantitas) {
            return back()->with('error', 'Stok tidak mencukupi');
        }

        $buktiPath = null;
        if ($request->hasFile('bukti_pembayaran')) {
            $disk = config('filesystems.default', 'public');
            $buktiPath = $request->file('bukti_pembayaran')->store('bukti_pembayaran', $disk);
        }

        $total_harga = $produk->harga * $request->kuantitas;

        $transaksi = Transaksi::create([
            'user_id' => Auth::id(),
            'produk_id' => $produk->id,
            'kuantitas' => $request->kuantitas,
            'total_harga' => $total_harga,
            'payment_method' => $request->payment_method,
            'game_id' => $produk->kategori_input === 'id_server' ? $request->game_id : null,
            'server_id' => $produk->kategori_input === 'id_server' ? $request->server_id : null,
            'catatan' => $request->catatan,
            'status' => 'pending',
            'bukti_pembayaran' => $buktiPath,
        ]);

        $produk->decrement('stok', $request->kuantitas);

        ActivityLog::log('checkout', 'Membeli ' . $produk->nama . ' x' . $request->kuantitas, [
            'transaksi_id' => $transaksi->id,
            'produk_id' => $produk->id,
            'total' => $total_harga,
        ]);

        return redirect()->route('user.dashboard')->with('success', 'Pesanan berhasil dibuat. Admin akan memverifikasi pembayaran Anda.');
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

        $pdf = Pdf::loadView('pdf.invoice', compact('transaksi'));
        return $pdf->download('invoice-'.$transaksi->id.'.pdf');
    }
}
