<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Produk;
use App\Models\Rating;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index()
    {
        $produks = Produk::latest()->get();
        
        $reviews = Rating::with(['user', 'produk'])
            ->where('rating', 5)
            ->latest()
            ->take(6)
            ->get();

        return Inertia::render('Welcome', [
            'produks' => $produks,
            'reviews' => $reviews,
        ]);
    }

    public function show($id)
    {
        $produk = Produk::with('ratings.user')->findOrFail($id);

        if (!$produk->is_active) {
            return redirect()->route('home')->with('error', 'Produk sedang dalam perawatan (maintenance).');
        }

        $avgRating = $produk->ratings()->avg('rating');
        
        return Inertia::render('Produk/Show', [
            'produk' => $produk,
            'avgRating' => $avgRating,
        ]);
    }
}
