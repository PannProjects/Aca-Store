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

        // Cek dulu apakah file ada di storage lokal (file lama)
        // Path fisik di Vercel: /var/task/user/storage/app/public/...
        if (file_exists(storage_path('app/public/' . $this->lokasi_gambar))) {
             return asset('storage/' . $this->lokasi_gambar);
        }

        // Jika tidak ada di lokal, asumsi ini file baru di Supabase
        if (config('filesystems.disks.supabase.bucket')) {
             $baseUrl = config('filesystems.disks.supabase.url');
             
             // Jika BASE URL kosong di .env, kita coba akali dari Endpoint
             if (empty($baseUrl)) {
                 $endpoint = config('filesystems.disks.supabase.endpoint');
                 // Endpoint: https://[ref].supabase.co/storage/v1/s3
                 // Public:  https://[ref].supabase.co/storage/v1/object/public
                 if ($endpoint) {
                    $baseUrl = str_replace('/s3', '/object/public', $endpoint);
                 }
             }

             $baseUrl = rtrim($baseUrl, '/');
             $bucket = config('filesystems.disks.supabase.bucket');
             $path = ltrim($this->lokasi_gambar, '/');
             
             return "{$baseUrl}/{$bucket}/{$path}";
        }

        return asset('storage/' . $this->lokasi_gambar);
    }

    // Append this attribute to array/json output
    protected $appends = ['lokasi_gambar_url'];
}
