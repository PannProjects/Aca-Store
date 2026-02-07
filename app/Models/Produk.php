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

    /**
     * Get the full URL for the image.
     */
    public function getLokasiGambarUrlAttribute()
    {
        if (!$this->lokasi_gambar) return null;
        
        if (filter_var($this->lokasi_gambar, FILTER_VALIDATE_URL)) {
            return $this->lokasi_gambar;
        }

        // Check if using Supabase disk
        if (config('filesystems.disks.supabase.bucket')) {
             return config('filesystems.disks.supabase.url') . '/' . config('filesystems.disks.supabase.bucket') . '/' . $this->lokasi_gambar;
        }

        return asset('storage/' . $this->lokasi_gambar);
    }

    // Append this attribute to array/json output
    protected $appends = ['lokasi_gambar_url'];
}
