<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'name' => 'Admin Libera',
            'email' => 'admin@libera.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
        ]);

        User::create([
            'name' => 'Pengguna Libera',
            'email' => 'user@libera.com',
            'password' => Hash::make('password'),
            'role' => 'user',
        ]);
    }
}
