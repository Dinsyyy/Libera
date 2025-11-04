<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Memanggil seeder yang sudah kita buat
        // UserSeeder HARUS dipanggil sebelum BookSeeder
        // (Jika nanti Anda buat seeder transaksi, user dan book harus ada dulu)
        $this->call([
            UserSeeder::class,
            BookSeeder::class,
        ]);
    }
}