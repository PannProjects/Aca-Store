<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Produk extends Model
{
    protected $fillable = [
        'nama',
        'deskripsi',
        'harga',
        'lokasi_gambar',
        'stok',
        'is_active',
        'user_id',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function ratings()
    {
        return $this->hasMany(Rating::class);
    }

    protected $casts = [
        'is_active' => 'boolean',
    ];
}
