<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Book; // <-- Import Model Book

class BookSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Menggunakan factory untuk membuat 50 data buku palsu
        Book::factory(50)->create();
    }
}