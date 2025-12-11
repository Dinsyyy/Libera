<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Hash;

class AdminUserController extends Controller
{
    public function index(): JsonResponse
    {
        $users = User::where('role', 'user')->latest()->paginate(10);

        return response()->json($users, 200);
    }

    public function update(Request $request, string $id): JsonResponse
    {
        $user = User::findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => [
                'required',
                'email',
                Rule::unique('users')->ignore($user->id),
            ],
            'password' => 'nullable|min:8|confirmed',
        ]);

        $user->name = $request->name;
        $user->email = $request->email;

        if ($request->filled('password')) {
            $user->password = Hash::make($request->password);
        }

        $user->save();

        return response()->json([
            'message' => 'Pengguna berhasil diperbarui.',
            'user' => $user,
        ]);
    }


    public function destroy(string $id): JsonResponse
    {
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
