<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Produk;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class AdminProdukController extends Controller
{
    public function index()
    {
        $produks = Produk::latest()->paginate(20);
        return Inertia::render('Admin/Produk', [
            'produks' => $produks,
        ]);
    }

    public function store(Request $request)
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

        $imagePath = null;
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

        Cache::forget('home.produks');

        return back()->with('success', 'Produk berhasil ditambahkan.');
    }

    public function edit($id)
    {
        $produk = Produk::findOrFail($id);
        return Inertia::render('Admin/EditProduk', [
            'produk' => $produk,
        ]);
    }

    public function update(Request $request, $id)
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

        Cache::forget('home.produks');

        return redirect()->route('admin.dashboard')->with('success', 'Produk berhasil diperbarui.');
    }

    public function destroy($id)
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

        Cache::forget('home.produks');
        
        return back()->with('success', 'Produk berhasil dihapus.');
    }
}
