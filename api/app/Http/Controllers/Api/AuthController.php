<?php

namespace App\Http\Controllers\Api;

use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Auth; // <-- Import Auth

class AuthController extends Controller
{
    /**
     * Fungsi untuk Registrasi User baru
     */
    public function register(Request $request)
    {
        // Validasi input
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed', // 'confirmed' berarti harus ada 'password_confirmation'
        ]);

        // Buat user baru
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'user', // Default role adalah 'user'
        ]);

        // Beri respons sukses
        return response()->json([
            'message' => 'Registrasi berhasil. Silakan login.'
        ], 201); // 201 = Created
    }

    /**
     * Fungsi untuk Login
     */
    public function login(Request $request)
    {
        // Validasi input
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        // Coba cari user berdasarkan email
        $user = User::where('email', $request->email)->first();

        // Jika user tidak ada ATAU password salah
        if (! $user || ! Hash::check($request->password, $user->password)) {
            // Lemparkan error
            throw ValidationException::withMessages([
                'email' => ['Email atau password salah.'],
            ]);
        }

        // Jika login berhasil, buat API token
        // Token ini akan digunakan oleh front-end untuk setiap request
        $token = $user->createToken('authToken')->plainTextToken;

        // Beri respons dengan data user dan token
        return response()->json([
            'message' => 'Login berhasil',
            'user' => [ // Kirim data user agar front-end tahu siapa yang login
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
            ],
            'token' => $token, // Kirim token-nya
        ], 200); // 200 = OK
    }

    /**
     * Fungsi untuk Logout
     */
    public function logout(Request $request)
    {
     // Hapus token yang sedang dipakai
     /** @phpstan-ignore-next-line */
     $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logout berhasil'
        ], 200); // 200 = OK
    }
}