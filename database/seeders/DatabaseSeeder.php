<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Produk;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Admin
        User::create([
            'name' => 'Aca & Pandu',
            'email' => 'admin@acastore.my.id',
            'password' => Hash::make('adminacastore'),
            'role' => 'admin',
        ]);
        // User
        User::create([
            'name' => 'Pandu Setya',
            'email' => 'pandu@acastore.my.id',
            'password' => Hash::make('pandusetya'),
            'role' => 'user',
        ]);
    }
}
