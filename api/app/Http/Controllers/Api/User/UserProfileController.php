<?php

namespace App\Http\Controllers\Api\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Storage;

class UserProfileController extends Controller
{
    // Update Profil (Nama, Email, Password)
    public function update(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,'.$user->id,
            'password' => 'nullable|min:8|confirmed',
            'photo' => 'nullable|image|max:2048', // Validasi Foto (Max 2MB)
        ]);

        $user->name = $request->name;
        $user->email = $request->email;

        if ($request->filled('password')) {
            $user->password = bcrypt($request->password);
        }

        // --- LOGIKA UPLOAD FOTO ---
        if ($request->hasFile('photo')) {
            // 1. Hapus foto lama jika ada (agar server tidak penuh)
            if ($user->profile_photo_path) {
                Storage::disk('public')->delete($user->profile_photo_path);
            }

            // 2. Simpan foto baru ke folder 'profile-photos'
            $path = $request->file('photo')->store('profile-photos', 'public');
            
            // 3. Simpan path ke database
            $user->profile_photo_path = $path;
        }
        // --------------------------

        $user->save();

        // Tambahkan URL lengkap foto ke response agar bisa langsung dipakai Front-End
        $user->profile_photo_url = $user->profile_photo_path 
            ? asset('storage/' . $user->profile_photo_path) 
            : null;

        return response()->json([
            'message' => 'Profil berhasil diperbarui.',
            'user' => $user
        ]);
    }
}