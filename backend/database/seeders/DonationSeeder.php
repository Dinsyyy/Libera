<?php

namespace Database\Seeders;

use App\Models\Donation;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DonationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('donations')->truncate(); // Clear table before seeding

        $user = User::first(); // Get the first user

        if (!$user) {
            echo "Skipping DonationSeeder: No users found.\n";
            return;
        }

        $donationsData = [
            [
                'book_title' => 'The Lord of the Rings',
                'author' => 'J.R.R. Tolkien',
                'status' => 'Diterima',
            ],
            [
                'book_title' => 'Pride and Prejudice',
                'author' => 'Jane Austen',
                'status' => 'Diproses',
            ],
            [
                'book_title' => 'To Kill a Mockingbird',
                'author' => 'Harper Lee',
                'status' => 'Masuk Rak',
            ],
            [
                'book_title' => 'War and Peace',
                'author' => 'Leo Tolstoy',
                'status' => 'Ditolak',
            ],
        ];

        foreach ($donationsData as $index => $data) {
            Donation::create([
                'user_id' => $user->id,
                'book_title' => $data['book_title'],
                'author' => $data['author'],
                'status' => $data['status'],
                'donation_date' => Carbon::now()->subDays(rand(1, 30)),
                'processing_date' => in_array($data['status'], ['Diproses', 'Masuk Rak', 'Ditolak']) ? Carbon::now()->subDays(rand(1, 10)) : null,
                'rack_date' => ($data['status'] == 'Masuk Rak') ? Carbon::now()->subDays(rand(0, 5)) : null,
            ]);
        }
        echo "Seeded " . count($donationsData) . " sample donation entries.\n";
    }
}
