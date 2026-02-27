<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\HasStorageUrl;

class Produk extends Model
{
    use HasStorageUrl;

    protected $fillable = [
        'nama',
        'deskripsi',
        'harga',
        'lokasi_gambar',
        'stok',
        'kategori_input',
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

    /**
     * Get the full URL for the image.
     */
    public function getLokasiGambarUrlAttribute()
    {
        return $this->getStorageUrl($this->lokasi_gambar);
    }

    // Append this attribute to array/json output
    protected $appends = ['lokasi_gambar_url'];
}
