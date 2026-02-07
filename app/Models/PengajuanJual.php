<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PengajuanJual extends Model
{
    protected $fillable = [
        'user_id',
        'produk_id',
        'nama_produk',
        'deskripsi_produk',
        'harga_diajukan',
        'stok',
        'lokasi_gambar',
        'status',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function produk() // For edit requests
    {
        return $this->belongsTo(Produk::class);
    }
}
