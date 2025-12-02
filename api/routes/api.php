<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController; // (A) Import Auth
use App\Http\Controllers\Api\BookController; // (B) Import Buku
use App\Http\Controllers\Api\Admin\AdminBookController;
use App\Http\Controllers\Api\TransactionController;
use App\Http\Controllers\Api\Admin\AdminDashboardController;
use App\Http\Controllers\Api\Admin\AdminTransactionController;
use App\Http\Controllers\Api\Admin\AdminUserController;
use App\Http\Controllers\Api\User\UserProfileController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// == (1) ROUTE PUBLIK ==
// Rute-rute ini tidak perlu login
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);


// == (2) ROUTE TERPROTEKSI / GRUP MIDDLEWARE ==
// Semua rute di dalam grup ini WAJIB menggunakan Bearer Token (sudah login)
// Inilah "grup middleware" yang kita maksud:
Route::middleware('auth:sanctum')->group(function () {

    // Rute untuk Auth
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // Rute untuk Buku (yang baru kita tambahkan)
    Route::get('/books', [BookController::class, 'index']);      // Daftar buku
    Route::get('/books/{id}', [BookController::class, 'show']);   // Detail buku
    Route::put('/user/profile', [UserProfileController::class, 'update']);

// POST /api/books/{id}/borrow (Aksi "Pinjam Buku Ini")
Route::post('/books/{id}/borrow', [TransactionController::class, 'borrowBook']);

// GET /api/my-transactions (Untuk Dashboard User "Buku yang Sedang Anda Pinjam")
Route::get('/my-transactions', [TransactionController::class, 'myTransactions']);

Route::get('/user/notifications', [App\Http\Controllers\Api\User\NotificationController::class, 'index']);
Route::post('/user/notifications/read', [App\Http\Controllers\Api\User\NotificationController::class, 'markAsRead']);
// == (3) ROUTE KHUSUS ADMIN ==
// Grup ini dilindungi oleh DUA middleware:
// 1. 'auth:sanctum' : Harus sudah login
// 2. 'admin' : Role-nya harus 'admin' (dari AdminMiddleware kita)

Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {

    // GET /api/admin/dashboard-stats
    Route::get('/dashboard-stats', [AdminDashboardController::class, 'getStats']);

    // CRUD Buku
    // POST /api/admin/books
    Route::post('/books', [AdminBookController::class, 'store']);

    // PUT /api/admin/books/{id}
    Route::put('/books/{id}', [AdminBookController::class, 'update']);

    // DELETE /api/admin/books/{id}
    Route::delete('/books/{id}', [AdminBookController::class, 'destroy']);

    // GET /api/admin/transactions (Lihat semua pinjaman aktif)
    Route::get('/transactions', [AdminTransactionController::class, 'index']);

    // POST /api/admin/transactions/{id}/return (Aksi mengembalikan)
    Route::post('/transactions/{id}/return', [AdminTransactionController::class, 'returnBook']);

    Route::get('/users', [AdminUserController::class, 'index']);

    // DELETE /api/admin/users/{id}
    Route::delete('/users/{id}', [AdminUserController::class, 'destroy']);

});

    // POST /api/admin/borrow (Catat Peminjaman)
    Route::post('/borrow', [App\Http\Controllers\Api\Admin\AdminTransactionController::class, 'store']);
    
    // POST /api/admin/return (Catat Pengembalian)
    Route::post('/return', [App\Http\Controllers\Api\Admin\AdminTransactionController::class, 'returnBook']);
    
    // GET /api/admin/active-loans (List buku yang sedang dipinjam)
    Route::get('/active-loans', [App\Http\Controllers\Api\Admin\AdminTransactionController::class, 'activeLoans']);

    Route::put('/profile', [App\Http\Controllers\Api\Admin\AdminProfileController::class, 'update']);
});