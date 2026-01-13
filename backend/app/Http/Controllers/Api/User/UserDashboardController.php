<?php

namespace App\Http\Controllers\Api\User;

use App\Http\Controllers\Controller;
use App\Models\Book;
use App\Models\BorrowTransaction;
use Carbon\Carbon;
use Illuminate\Http\Request;

class UserDashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        // Reminders for books due in the next 3 days
        $reminders = BorrowTransaction::with('book')
            ->where('user_id', $user->id)
            ->where('status', 'dipinjam')
            ->whereDate('due_date', '<=', Carbon::now()->addDays(3))
            ->get();

        // Book of the Day: a single random book
        $bookOfTheDay = Book::inRandomOrder()
            ->whereNotNull('cover_image_url')
            ->whereNotNull('synopsis')
            ->first();

        // Trending books (latest 5)
        $trending = Book::latest()->take(5)->get();

        // Exclude bookOfTheDay and trending books from general recommendations pool
        $excludedBookIds = collect([$bookOfTheDay?->id])
            ->merge($trending->pluck('id'))
            ->filter()
            ->unique()
            ->toArray();

        // Genre-based recommendations
        $targetCategories = ['Fiksi', 'Teknologi', 'Bisnis', 'Pengembangan Diri', 'Misteri', 'Sains', 'Sejarah'];
        $genreRecommendations = [];

        foreach ($targetCategories as $category) {
            $booksInCategory = Book::where('category', $category)
                ->whereNotIn('id', $excludedBookIds)
                ->inRandomOrder()
                ->take(2) // Get 2 books per category
                ->get();

            if ($booksInCategory->isNotEmpty()) {
                $genreRecommendations[] = [
                    'category' => $category,
                    'books' => $booksInCategory,
                ];
            }
        }

        return response()->json([
            'reminders' => $reminders,
            'book_of_the_day' => $bookOfTheDay,
            'trending' => $trending,
            'genre_recommendations' => $genreRecommendations,
        ]);
    }
}
