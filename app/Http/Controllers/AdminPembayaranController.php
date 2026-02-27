<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Transaksi;
use Inertia\Inertia;

class AdminPembayaranController extends Controller
{
    public function index(Request $request)
    {
        $status = $request->get('status', 'pending');

        $query = Transaksi::with(['user', 'produk'])->latest();

        if ($status !== 'all') {
            $query->where('status', $status);
        }

        $transactions = $query->paginate(20)->withQueryString();
        $pendingCount = Transaksi::where('status', 'pending')->count();

        return Inertia::render('Admin/Pembayaran', [
            'transactions' => $transactions,
            'pendingCount' => $pendingCount,
            'activeStatus' => $status,
        ]);
    }

    public function confirm($id, $status)
    {
        $transaksi = Transaksi::findOrFail($id);
        
        if ($status !== 'paid') {
            abort(400, 'Hanya status PAID yang diizinkan melalui rute ini.');
        }

        $transaksi->update(['status' => 'paid']);
        
        \App\Models\ActivityLog::log('confirm_payment', 'Mengkonfirmasi pembayaran #' . str_pad($transaksi->id, 5, '0', STR_PAD_LEFT), [
            'transaksi_id' => $transaksi->id,
            'user_name' => $transaksi->user->name,
        ]);

        \App\Models\Notification::send(
            $transaksi->user_id,
            'payment_confirmed',
            'Pembayaran Diterima ✅',
            'Pembayaran untuk pesanan #' . str_pad($transaksi->id, 5, '0', STR_PAD_LEFT) . ' telah diverifikasi admin.',
            ['transaksi_id' => $transaksi->id]
        );

        return back()->with('success', 'Pembayaran dikonfirmasi.');
    }

    public function reject(Request $request, $id)
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

    public function destroy($id)
    {
        $transaksi = Transaksi::findOrFail($id);

        if (in_array($transaksi->status, ['pending', 'paid']) && $transaksi->produk) {
            $transaksi->produk->increment('stok', $transaksi->kuantitas);
        }

        $orderId = '#INV-' . str_pad($transaksi->id, 5, '0', STR_PAD_LEFT);
        $userName = $transaksi->user ? $transaksi->user->name : 'Unknown';

        if ($transaksi->user_id) {
            \App\Models\Notification::send(
                $transaksi->user_id,
                'transaction_deleted',
                'Transaksi Dihapus 🗑️',
                "Pesanan {$orderId} telah dihapus oleh admin.",
                ['transaksi_id' => $transaksi->id]
            );
        }

        $transaksi->delete();

        \App\Models\ActivityLog::log('delete_transaction', "Menghapus transaksi {$orderId} milik {$userName}", [
            'transaksi_id' => $id,
        ]);

        return back()->with('success', "Transaksi {$orderId} berhasil dihapus.");
    }
}
