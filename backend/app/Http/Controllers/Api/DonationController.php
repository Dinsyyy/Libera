<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Donation;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DonationController extends Controller
{
    public function store(Request $request)
    {
        $user = Auth::user();

        $validated = $request->validate([
            'book_title' => 'required|string|max:255',
            'author' => 'required|string|max:255',
        ]);

        $donation = Donation::create([
            'user_id' => $user->id,
            'book_title' => $validated['book_title'],
            'author' => $validated['author'],
            'donation_date' => Carbon::now(),
            'status' => 'Diterima', // Initial status
        ]);

        return response()->json([
            'message' => 'Sumbangan buku berhasil diajukan! Anda akan menerima notifikasi mengenai statusnya.',
            'donation' => $donation,
        ], 201);
    }

    public function index()
    {
        $user = Auth::user();
        $donations = Donation::where('user_id', $user->id)
            ->latest('donation_date')
            ->get();

        return response()->json($donations);
    }
}
