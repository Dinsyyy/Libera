<?php

namespace Database\Seeders;

use App\Models\Book;
use App\Models\ReadingProgress;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ReadingProgressSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('reading_progress')->truncate(); // Clear table before seeding

        $user = User::first(); // Get the first user
        // Get books that have total_pages defined for more realistic progress
        $books = Book::whereNotNull('total_pages')->get(); 

        if (!$user || $books->isEmpty()) {
            echo "Skipping ReadingProgressSeeder: No users or books with total_pages found.\n";
            return;
        }

        $progressBooks = $books->random(min(5, $books->count())); // Get 5 random books

        foreach ($progressBooks as $index => $book) {
            $startDate = Carbon::now()->subDays(rand(10, 30));
            $currentPage = 0;
            $status = 'paused';

            if ($index % 3 == 0) { // Simulate reading
                $currentPage = rand(1, $book->total_pages - 1);
                $status = 'reading';
            } elseif ($index % 3 == 1) { // Simulate finished
                $currentPage = $book->total_pages;
                $status = 'finished';
            } // else paused (default)

            ReadingProgress::create([
                'user_id' => $user->id,
                'book_id' => $book->id,
                'current_page' => $currentPage,
                'status' => $status,
                'start_date' => $startDate->toDateString(),
                'last_read_date' => Carbon::now()->subDays(rand(0, 5))->toDateString(),
            ]);
        }
        echo "Seeded " . $progressBooks->count() . " sample reading progress entries.\n";
    }
}
