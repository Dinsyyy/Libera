<?php

namespace App\Http\Controllers\Api\User;

use App\Http\Controllers\Controller;
use App\Models\Book;
use App\Models\BorrowTransaction;
use App\Models\Donation;
use App\Models\ReadingProgress;
use App\Models\Review;
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

        // Fetch all potential books for recommendations in one go
        $allGenreBooks = Book::withCount('reviews')
            ->withAvg('reviews', 'rating')
            ->whereIn('category', $targetCategories)
            ->whereNotIn('id', $excludedBookIds)
            ->get()
            ->shuffle(); // Shuffle once to get random selection

        foreach ($targetCategories as $category) {
            $booksInCategory = $allGenreBooks->where('category', $category)->take(2);

            if ($booksInCategory->isNotEmpty()) {
                $genreRecommendations[] = [
                    'category' => $category,
                    'books' => $booksInCategory->values(), // Reset keys
                ];
            }
        }

        // --- Latest Activities ---
        $borrowActivities = BorrowTransaction::where('user_id', $user->id)
            ->with('book:id,title,author')
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($activity) {
                return [
                    'type' => $activity->status === 'dipinjam' ? 'borrowed' : 'returned',
                    'description' => $activity->status === 'dipinjam' ? 
                                     'Meminjam buku "' . $activity->book->title . '"' :
                                     'Mengembalikan buku "' . $activity->book->title . '"',
                    'book_id' => $activity->book_id,
                    'book_title' => $activity->book->title,
                    'timestamp' => $activity->updated_at,
                ];
            });

        $readingActivities = ReadingProgress::where('user_id', $user->id)
            ->with('book:id,title,author')
            ->latest('updated_at')
            ->take(5)
            ->get()
            ->map(function ($activity) {
                return [
                    'type' => 'reading_progress',
                    'description' => 'Memperbarui progres membaca buku "' . $activity->book->title . '" ke halaman ' . $activity->current_page . ' (' . $activity->status . ')',
                    'book_id' => $activity->book_id,
                    'book_title' => $activity->book->title,
                    'timestamp' => $activity->updated_at,
                ];
            });

        $reviewActivities = Review::where('user_id', $user->id)
            ->with('book:id,title,author')
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($activity) {
                return [
                    'type' => 'review',
                    'description' => 'Memberi ulasan ' . $activity->rating . ' bintang untuk buku "' . $activity->book->title . '"',
                    'book_id' => $activity->book_id,
                    'book_title' => $activity->book->title,
                    'timestamp' => $activity->created_at,
                ];
            });
        
        $donationActivities = Donation::where('user_id', $user->id)
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($activity) {
                return [
                    'type' => 'donation',
                    'description' => 'Mengajukan sumbangan buku "' . $activity->book_title . '" (Status: ' . $activity->status . ')',
                    'book_id' => null, // Donations don't directly link to a book ID in the books table yet
                    'book_title' => $activity->book_title,
                    'timestamp' => $activity->created_at,
                ];
            });

        $latestActivities = $borrowActivities
            ->merge($readingActivities)
            ->merge($reviewActivities)
            ->merge($donationActivities)
            ->sortByDesc('timestamp')
            ->take(7)
            ->values(); // Reset keys after sorting and limiting

        return response()->json([
            'reminders' => $reminders,
            'book_of_the_day' => $bookOfTheDay,
            'trending' => $trending,
            'genre_recommendations' => $genreRecommendations,
            'latest_activities' => $latestActivities,
        ]);
    }
}
