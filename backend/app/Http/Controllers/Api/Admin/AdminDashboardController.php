<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Book;
use App\Models\BorrowTransaction;
use App\Models\Donation;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;

class AdminDashboardController extends Controller
{
    public function getStats(): JsonResponse
    {
        $totalBooks = Book::count();
        $totalUsers = User::where('role', 'user')->count();
        $booksBorrowed = BorrowTransaction::where('status', 'dipinjam')->count();

        // --- Latest Activities for Admin Dashboard ---
        $borrowActivities = BorrowTransaction::with(['book:id,title', 'user:id,name'])
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($activity) {
                return [
                    'type' => $activity->status === 'dipinjam' ? 'borrowed' : 'returned',
                    'description' => ($activity->status === 'dipinjam' ? 'Pengguna ' : 'Pengguna ') . 
                                     $activity->user->name . ($activity->status === 'dipinjam' ? ' meminjam ' : ' mengembalikan ') . 
                                     'buku "' . $activity->book->title . '"',
                    'book_id' => $activity->book_id,
                    'book_title' => $activity->book->title,
                    'user_id' => $activity->user_id,
                    'user_name' => $activity->user->name,
                    'timestamp' => $activity->updated_at,
                ];
            });

        $newUsers = User::latest()->take(3)->get()
            ->map(function ($user) {
                return [
                    'type' => 'user_registered',
                    'description' => 'Pengguna baru mendaftar: ' . $user->name,
                    'user_id' => $user->id,
                    'user_name' => $user->name,
                    'timestamp' => $user->created_at,
                ];
            });
        
        $newBooks = Book::latest()->take(3)->get()
            ->map(function ($book) {
                return [
                    'type' => 'book_added',
                    'description' => 'Buku baru ditambahkan: "' . $book->title . '" oleh ' . $book->author,
                    'book_id' => $book->id,
                    'book_title' => $book->title,
                    'timestamp' => $book->created_at,
                ];
            });

        $donationRequests = Donation::with('user:id,name')
            ->latest()
            ->take(3)
            ->get()
            ->map(function ($donation) {
                return [
                    'type' => 'donation_request',
                    'description' => 'Permintaan sumbangan baru dari ' . $donation->user->name . ' untuk "' . $donation->book_title . '"',
                    'user_id' => $donation->user_id,
                    'user_name' => $donation->user->name,
                    'book_title' => $donation->book_title,
                    'timestamp' => $donation->created_at,
                ];
            });

        $latestActivities = $borrowActivities
            ->merge($newUsers)
            ->merge($newBooks)
            ->merge($donationRequests)
            ->sortByDesc('timestamp')
            ->take(10)
            ->values();

        return response()->json([
            'total_books' => $totalBooks,
            'total_users' => $totalUsers,
            'books_borrowed' => $booksBorrowed,
            'latest_activities' => $latestActivities,
        ], 200);
    }
}
