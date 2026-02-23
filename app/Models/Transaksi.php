<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Transaksi extends Model
{
    protected $fillable = [
        'user_id',
        'produk_id',
        'kuantitas',
        'total_harga',
        'payment_method',
        'status',
        'game_id',
        'server_id',
        'catatan',
        'bukti_pembayaran',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function produk()
    {
        return $this->belongsTo(Produk::class);
    }

    public function getBuktiPembayaranUrlAttribute()
    {
        if (!$this->bukti_pembayaran) return null;
        
        if (filter_var($this->bukti_pembayaran, FILTER_VALIDATE_URL)) {
            return $this->bukti_pembayaran;
        }

        if (file_exists(storage_path('app/public/' . $this->bukti_pembayaran))) {
             return asset('storage/' . $this->bukti_pembayaran);
        }

        if (config('filesystems.disks.supabase.bucket')) {
             $baseUrl = config('filesystems.disks.supabase.url');
             
             if (empty($baseUrl)) {
                 $endpoint = config('filesystems.disks.supabase.endpoint');
                 if ($endpoint) {
                    $baseUrl = str_replace('/s3', '/object/public', $endpoint);
                 }
             }

             $baseUrl = rtrim($baseUrl, '/');
             $bucket = config('filesystems.disks.supabase.bucket');
             $path = ltrim($this->bukti_pembayaran, '/');
             
             return "{$baseUrl}/{$bucket}/{$path}";
        }

        return asset('storage/' . $this->bukti_pembayaran);
    }

    protected $appends = ['bukti_pembayaran_url'];
}
