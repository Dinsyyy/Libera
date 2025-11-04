<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\User; // <-- Import User
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth; // <-- Import Auth

class AdminUserController extends Controller
{
    /**
     * Menampilkan daftar semua pengguna (role 'user').
     * GET /api/admin/users
     */
    public function index(): JsonResponse
    {
        // Ambil semua user yang role-nya 'user'
        $users = User::where('role', 'user')->latest()->get();
        return response()->json($users, 200);
    }

    /**
     * Menghapus pengguna.
     * DELETE /api/admin/users/{id}
     */
    public function destroy(string $id): JsonResponse
    {
        // Pastikan admin tidak bisa menghapus diri sendiri
        if (Auth::id() == $id) {
            return response()->json(['message' => 'Admin tidak dapat menghapus akun sendiri.'], 403);
        }

        try {
            $user = User::findOrFail($id);
            $user->delete();

            return response()->json(['message' => 'Pengguna berhasil dihapus.'], 200);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['message' => 'Pengguna tidak ditemukan.'], 404);
        }
    }
}