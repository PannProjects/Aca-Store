<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Produk;
use App\Models\Transaksi;
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

    public function logIndex()
    {
        $activities = \App\Models\ActivityLog::with('user')->latest()->paginate(30);
        return Inertia::render('Admin/Log', [
            'activities' => $activities,
        ]);
    }
}
