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
}
