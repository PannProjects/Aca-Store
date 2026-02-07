<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Request;

class ActivityLog extends Model
{
    protected $fillable = [
        'user_id',
        'activity_type',
        'description',
        'metadata',
        'ip_address',
    ];

    protected $casts = [
        'metadata' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Helper untuk membuat log aktivitas
     */
    public static function log($type, $description, $metadata = null)
    {
        if (!Auth::check()) return null;
        
        return self::create([
            'user_id' => Auth::id(),
            'activity_type' => $type,
            'description' => $description,
            'metadata' => $metadata,
            'ip_address' => Request::ip(),
        ]);
    }
}
