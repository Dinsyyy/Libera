<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Book;
use App\Models\User;
use App\Models\BorrowTransaction;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class AdminDashboardController extends Controller
{
    /**
     * Mengambil statistik untuk dashboard admin.
     * GET /api/admin/dashboard-stats
     */
    public function getStats(): JsonResponse
    {
        // 1. Total Buku (menghitung semua baris di tabel books)
        $totalBooks = Book::count();

        // 2. Total Pengguna (menghitung user dengan role 'user')
        $totalUsers = User::where('role', 'user')->count();
        
        // 3. Buku Dipinjam (menghitung transaksi yang statusnya 'dipinjam')
        $booksBorrowed = BorrowTransaction::where('status', 'dipinjam')->count();

        // Kembalikan data dalam format JSON
        return response()->json([
            'total_books' => $totalBooks,
            'total_users' => $totalUsers,
            'books_borrowed' => $booksBorrowed,
        ], 200);
    }
}