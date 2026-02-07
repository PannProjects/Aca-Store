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
        return Inertia::render('Welcome', [
            'produks' => $produks,
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
