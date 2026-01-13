<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            UserSeeder::class,
            BookSeeder::class,
            BorrowTransactionSeeder::class,
            ReadingProgressSeeder::class,
            ReviewSeeder::class,
            DonationSeeder::class,
        ]);
    }
}
