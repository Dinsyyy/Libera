<?php

namespace Database\Seeders;

use App\Http\Controllers\Api\ReviewController; // Import the controller to use its method
use App\Models\Book;
use App\Models\Review;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ReviewSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('reviews')->truncate(); // Clear table before seeding

        $user = User::first(); // Get the first user
        $books = Book::all(); // Get all books

        if (!$user || $books->isEmpty()) {
            echo "Skipping ReviewSeeder: No users or books found.\n";
            return;
        }

        $reviewBooks = $books->random(min(5, $books->count())); // Get 5 random books

        $reviewController = new ReviewController(); // Instantiate the controller

        foreach ($reviewBooks as $book) {
            $rating = rand(3, 5); // Random rating between 3 and 5
            $comment = "Buku ini sangat " . (['bagus', 'menarik', 'mencerahkan', 'inspiratif', 'luar biasa'][rand(0, 4)]) . ". Sangat direkomendasikan!";

            Review::create([
                'user_id' => $user->id,
                'book_id' => $book->id,
                'rating' => $rating,
                'comment' => $comment,
            ]);

            // Update the book's average rating and total reviews
            $reviewController->calculateAverageRating($book->id);
        }
        echo "Seeded " . $reviewBooks->count() . " sample review entries.\n";
    }
}
