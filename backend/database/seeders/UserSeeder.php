<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB; // Import DB facade

class UserSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('users')->truncate(); // Truncate table before seeding

        // Create default admin user
        User::create([
            'name' => 'Admin Libera',
            'email' => 'admin@libera.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
        ]);

        // Create default regular user
        User::create([
            'name' => 'Pengguna Libera',
            'email' => 'user@libera.com',
            'password' => Hash::make('password'),
            'role' => 'user',
        ]);

        // Create 20 additional regular users using the factory
        User::factory()->count(20)->create([
            'password' => Hash::make('password'), // Ensure a common password for easier testing
            'role' => 'user',
        ]);

        echo "Seeded 22 sample users (1 admin, 1 default user, 20 factory users).\n";
    }
}
