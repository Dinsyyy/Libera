<?php

use App\Http\Controllers\Api\Admin\AdminBookController;
use App\Http\Controllers\Api\Admin\AdminDashboardController;
use App\Http\Controllers\Api\Admin\AdminTransactionController;
use App\Http\Controllers\Api\Admin\AdminUserController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BookController;
use App\Http\Controllers\Api\PublicBookController;
use App\Http\Controllers\Api\TransactionController;
use App\Http\Controllers\Api\User\UserProfileController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/books', [PublicBookController::class, 'index']);
Route::get('/books/{id}', [PublicBookController::class, 'show']);

Route::middleware('auth:sanctum')->group(function () {

    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::get('/books', [BookController::class, 'index']);
    Route::get('/books/{id}', [BookController::class, 'show']);
    Route::put('/user/profile', [UserProfileController::class, 'update']);

    Route::post('/books/{id}/borrow', [TransactionController::class, 'borrowBook']);

    Route::get('/my-transactions', [TransactionController::class, 'myTransactions']);

    Route::get('/user/notifications', [App\Http\Controllers\Api\User\NotificationController::class, 'index']);
    Route::post('/user/notifications/read', [App\Http\Controllers\Api\User\NotificationController::class, 'markAsRead']);
    Route::get('/user/home', [App\Http\Controllers\Api\User\UserDashboardController::class, 'index']);
    Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {

        Route::get('/dashboard-stats', [AdminDashboardController::class, 'getStats']);
        Route::post('/books', [AdminBookController::class, 'store']);
        Route::put('/books/{id}', [AdminBookController::class, 'update']);
        Route::delete('/books/{id}', [AdminBookController::class, 'destroy']);
        Route::get('/transactions', [AdminTransactionController::class, 'index']);
        Route::post('/transactions', [AdminTransactionController::class, 'store']);
        Route::post('/transactions/{id}/return', [AdminTransactionController::class, 'returnBook']);
        Route::get('/users', [AdminUserController::class, 'index']);
        Route::put('/users/{id}', [AdminUserController::class, 'update']);
        Route::delete('/users/{id}', [AdminUserController::class, 'destroy']);
        Route::get('/active-loans', [AdminTransactionController::class, 'activeLoans']);

    });

    Route::put('/profile', [App\Http\Controllers\Api\Admin\AdminProfileController::class, 'update']);
});
