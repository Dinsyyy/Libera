<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User; // <-- Import Model User
use Illuminate\Support\Facades\Hash; // <-- Import Hash untuk enkripsi password

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Membuat Akun Admin
        User::create([
            'name' => 'Admin Libera',
            'email' => 'admin@libera.com',
            'password' => Hash::make('password'),
            'role' => 'admin', // Sesuai dengan migrasi kita
        ]);

        // 2. Membuat Akun User Biasa
        User::create([
            'name' => 'Pengguna Libera',
            'email' => 'user@libera.com',
            'password' => Hash::make('password'),
            'role' => 'user', // Default
        ]);
    }
}