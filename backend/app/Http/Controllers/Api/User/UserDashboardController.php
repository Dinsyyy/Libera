<?php

namespace App\Http\Controllers\Api\User;

use App\Http\Controllers\Controller;
use App\Models\Book;
use App\Models\BorrowTransaction;
use Carbon\Carbon;
use Illuminate\Http\Request;

class UserDashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $reminders = BorrowTransaction::with('book')
            ->where('user_id', $user->id)
            ->where('status', 'dipinjam')
            ->whereDate('due_date', '<=', Carbon::now()->addDays(3))
            ->get();

        $trending = Book::latest()->take(5)->get();

        $recommendations = Book::inRandomOrder()
            ->whereNotIn('id', $trending->pluck('id'))
            ->take(4)
            ->get();

        return response()->json([
            'reminders' => $reminders,
            'trending' => $trending,
            'recommendations' => $recommendations,
        ]);
    }
}
