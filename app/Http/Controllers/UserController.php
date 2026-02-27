<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use App\Models\Rating;
use App\Models\Produk;
use App\Models\Transaksi;
use App\Models\ActivityLog;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $transaksis = $user->transaksis()->with('produk')->latest()->take(3)->get();
        $totalPengeluaran = $user->transaksis()->whereIn('status', ['paid', 'completed'])->sum('total_harga');

        return Inertia::render('User/Dashboard', [
            'transaksis' => $transaksis,
            'totalPengeluaran' => $totalPengeluaran,
        ]);
    }

    public function activityLog()
    {
        $user = Auth::user();
        $activities = ActivityLog::where('user_id', $user->id)->latest()->paginate(20);
        return Inertia::render('User/ActivityLog', [
            'activities' => $activities,
        ]);
    }

    public function pesanan()
    {
        $user = Auth::user();
        $transaksis = $user->transaksis()->with('produk')->latest()->paginate(15);
        return Inertia::render('User/Pesanan', [
            'transaksis' => $transaksis,
        ]);
    }

    public function rate(Request $request)
    {
        $request->validate([
            'produk_id' => 'required|exists:produks,id',
            'rating' => 'required|integer|min:1|max:5',
            'review' => 'nullable|string|max:1000'
        ]);

        $hasPurchased = Transaksi::where('user_id', Auth::id())
            ->where('produk_id', $request->produk_id)
            ->whereIn('status', ['paid', 'completed'])
            ->exists();

        if (!$hasPurchased) {
            return back()->with('error', 'Anda harus membeli produk ini terlebih dahulu sebelum memberikan ulasan.');
        }

        $produk = Produk::find($request->produk_id);

        Rating::updateOrCreate(
            ['user_id' => Auth::id(), 'produk_id' => $request->produk_id],
            ['rating' => $request->rating, 'review' => $request->review]
        );

        ActivityLog::log('rating', 'Memberi rating ' . $request->rating . '★ untuk ' . $produk->nama, [
            'produk_id' => $request->produk_id,
            'rating' => $request->rating,
        ]);

        Cache::forget('home.reviews');

        return back()->with('success', 'Terima kasih atas penilaian Anda.');
    }

    public function editProfile()
    {
        $user = Auth::user();
        return Inertia::render('User/EditProfile', [
            'user' => $user,
        ]);
    }

    public function updateProfile(Request $request)
    {
        $user = Auth::user();

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,'.$user->id,
            'password' => 'nullable|string|min:8|confirmed',
        ], [
            'password.min' => 'Password minimal 8 karakter.',
            'password.confirmed' => 'Konfirmasi password tidak cocok.',
            'email.unique' => 'Email sudah digunakan.',
        ]);

        $user->name = $request->name;
        $user->email = $request->email;

        if ($request->filled('password')) {
            $user->password = \Illuminate\Support\Facades\Hash::make($request->password);
        }

        $user->save();

        ActivityLog::log('update_profile', 'Memperbarui profil');

        return redirect()->route('user.dashboard')->with('success', 'Profil berhasil diperbarui.');
    }
}
