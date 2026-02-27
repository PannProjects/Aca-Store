<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\HasStorageUrl;

class Transaksi extends Model
{
    use HasStorageUrl;

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
        'alasan_penolakan',
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
        return $this->getStorageUrl($this->bukti_pembayaran);
    }

    protected $appends = ['bukti_pembayaran_url'];
}
