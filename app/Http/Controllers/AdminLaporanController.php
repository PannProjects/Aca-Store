<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Transaksi;
use Inertia\Inertia;

class AdminLaporanController extends Controller
{
    public function index(Request $request)
    {
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

        $query->whereYear('created_at', $tahun);
        if ($bulan != 'all') {
            $query->whereMonth('created_at', $bulan);
        }

        $transaksis = $query->get();
        $totalPendapatan = $transaksis->sum('total_harga');
        $totalTransaksi = $transaksis->count();
        $totalItemTerjual = $transaksis->sum('kuantitas');
        $rataRataOrder = $totalTransaksi > 0 ? round($totalPendapatan / $totalTransaksi) : 0;

        $produkBreakdown = $transaksis->groupBy('produk_id')->map(function ($items) use ($totalPendapatan) {
            $produk = $items->first()->produk;
            $subtotal = $items->sum('total_harga');
            return [
                'nama' => $produk ? $produk->nama : 'Produk Dihapus',
                'jumlah_terjual' => $items->sum('kuantitas'),
                'total_pendapatan' => $subtotal,
                'persentase' => $totalPendapatan > 0 ? round(($subtotal / $totalPendapatan) * 100, 1) : 0,
            ];
        })->sortByDesc('total_pendapatan')->values();

        $yearQuery = Transaksi::whereIn('status', ['paid', 'completed'])
            ->whereYear('created_at', $tahun)
            ->get();

        $monthlyBreakdown = [];
        foreach ($namaBulan as $key => $val) {
            $monthlyBreakdown[] = [
                'bulan' => $key,
                'nama_bulan' => substr($val, 0, 3),
                'total_pendapatan' => 0,
                'jumlah_transaksi' => 0,
            ];
        }

        $grouped = $yearQuery->groupBy(function ($item) {
            return \Carbon\Carbon::parse($item->created_at)->format('n');
        });

        foreach ($grouped as $monthNum => $items) {
            $idx = (int) $monthNum - 1;
            if (isset($monthlyBreakdown[$idx])) {
                $monthlyBreakdown[$idx]['total_pendapatan'] = $items->sum('total_harga');
                $monthlyBreakdown[$idx]['jumlah_transaksi'] = $items->count();
            }
        }

        $recentTransactions = $transaksis->take(10)->map(function ($t) {
            return [
                'id' => $t->id,
                'user' => $t->user ? $t->user->name : '-',
                'produk' => $t->produk ? $t->produk->nama : 'Dihapus',
                'kuantitas' => $t->kuantitas,
                'total_harga' => $t->total_harga,
                'status' => $t->status,
                'tanggal' => $t->created_at->format('d M Y, H:i'),
            ];
        })->values();

        $firstTransaction = Transaksi::oldest()->first();
        $startYear = $firstTransaction ? $firstTransaction->created_at->year : now()->year;
        $years = range($startYear, now()->year);

        $pendingCount = Transaksi::where('status', 'pending')->count();

        return Inertia::render('Admin/Laporan', [
            'totalPendapatan' => $totalPendapatan,
            'totalTransaksi' => $totalTransaksi,
            'totalItemTerjual' => $totalItemTerjual,
            'rataRataOrder' => $rataRataOrder,
            'produkBreakdown' => $produkBreakdown,
            'monthlyStats' => $monthlyBreakdown,
            'recentTransactions' => $recentTransactions,
            'pendingCount' => $pendingCount,
            'bulan' => $bulan,
            'tahun' => (int) $tahun,
            'years' => $years,
            'namaBulan' => $namaBulan,
        ]);
    }
}
