<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Book;
use App\Models\BorrowTransaction;
use App\Models\User;
use Illuminate\Http\JsonResponse;

class AdminDashboardController extends Controller
{
    public function getStats(): JsonResponse
    {
        $totalBooks = Book::count();

        $totalUsers = User::where('role', 'user')->count();

        $booksBorrowed = BorrowTransaction::where('status', 'dipinjam')->count();

        return response()->json([
            'total_books' => $totalBooks,
            'total_users' => $totalUsers,
            'books_borrowed' => $booksBorrowed,
        ], 200);
    }
}
