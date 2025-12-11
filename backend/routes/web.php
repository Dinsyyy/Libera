<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\WebAuthController;
use App\Http\Controllers\HomeController;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

Route::get('/', function () {
    return view('welcome');
});

Route::get('login', [WebAuthController::class, 'showLoginForm'])->name('login');
Route::post('login', [WebAuthController::class, 'login']);
Route::get('register', [WebAuthController::class, 'showRegistrationForm'])->name('register');
Route::post('register', [WebAuthController::class, 'register']);

Route::middleware('auth')->group(function () {
    Route::get('/home', [HomeController::class, 'index'])->name('home');
    Route::post('logout', [WebAuthController::class, 'logout'])->name('logout');
});

Route::get('/buat-user-baru', function () {
    try {
        $user = User::updateOrCreate(
            ['email' => 'penggunabaru@libera.com'],
            [
                'name' => 'Pengguna Baru',
                'password' => Hash::make('password123'),
                'role' => 'user'
            ]
        );
        return "Berhasil! Akun 'penggunabaru@libera.com' dengan password 'password123' telah dibuat. Silakan coba login.";
    } catch (\Exception $e) {
        return "Gagal membuat akun: " . $e->getMessage();
    }
});
