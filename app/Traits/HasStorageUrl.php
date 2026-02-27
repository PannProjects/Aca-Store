<?php

namespace App\Traits;

/**
 * Trait untuk generate URL file dari storage (lokal atau Supabase).
 * 
 * Gunakan method getStorageUrl($path) di accessor model.
 */
trait HasStorageUrl
{
    /**
     * Generate URL lengkap untuk file di storage.
     * Mendukung: URL absolut, file lokal, dan Supabase S3.
     */
    protected function getStorageUrl(?string $path): ?string
    {
        if (!$path) return null;

        // Jika sudah berupa URL lengkap
        if (filter_var($path, FILTER_VALIDATE_URL)) {
            return $path;
        }

        // Cek file lokal
        if (file_exists(storage_path('app/public/' . $path))) {
            return asset('storage/' . $path);
        }

        // Supabase S3
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
            $filePath = ltrim($path, '/');

            return "{$baseUrl}/{$bucket}/{$filePath}";
        }

        // Fallback ke storage lokal
        return asset('storage/' . $path);
    }
}
