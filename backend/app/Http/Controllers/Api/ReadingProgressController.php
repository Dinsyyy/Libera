<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Book;
use App\Models\ReadingProgress;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class ReadingProgressController extends Controller
{
    public function store(Request $request)
    {
        $user = Auth::user();

        $validated = $request->validate([
            'book_id' => 'required|exists:books,id',
            'current_page' => 'required|integer|min:0',
            'status' => ['required', 'string', Rule::in(['reading', 'finished', 'paused'])],
        ]);

        $book = Book::find($validated['book_id']);

        // Check if current_page exceeds total_pages
        if ($book->total_pages && $validated['current_page'] > $book->total_pages) {
            return response()->json(['message' => 'Halaman saat ini melebihi total halaman buku.'], 422);
        }
        
        // Ensure status is 'finished' if current_page equals total_pages
        if ($book->total_pages && $validated['current_page'] == $book->total_pages) {
            $validated['status'] = 'finished';
        }

        $readingProgress = ReadingProgress::updateOrCreate(
            [
                'user_id' => $user->id,
                'book_id' => $validated['book_id'],
            ],
            [
                'current_page' => $validated['current_page'],
                'status' => $validated['status'],
                'start_date' => ReadingProgress::where('user_id', $user->id)
                                    ->where('book_id', $validated['book_id'])
                                    ->value('start_date') ?? Carbon::now(),
                'last_read_date' => Carbon::now(),
            ]
        );

        return response()->json([
            'message' => 'Progres membaca berhasil diperbarui!',
            'reading_progress' => $readingProgress->load('book'),
        ], 200);
    }

    public function index()
    {
        $user = Auth::user();
        $readingProgress = ReadingProgress::where('user_id', $user->id)
            ->with('book')
            ->latest('last_read_date')
            ->get();

        return response()->json($readingProgress);
    }

    public function leaderboard()
    {
        // For simplicity, sum of current_page for 'finished' books as a metric.
        // A more complex metric could involve actual pages read (diff between start and current).
        $leaderboard = User::withCount(['readingProgress as total_pages_read' => function ($query) {
                $query->selectRaw('sum(current_page)'); // Sum of current_page
            }])
            ->orderByDesc('total_pages_read')
            ->take(10) // Top 10 readers
            ->get(['id', 'name']);

        return response()->json($leaderboard);
    }

    public function show(string $book_id)
    {
        $user = Auth::user();
        $readingProgress = ReadingProgress::where('user_id', $user->id)
            ->where('book_id', $book_id)
            ->with('book')
            ->first();

        if (!$readingProgress) {
            return response()->json(['message' => 'Progres membaca tidak ditemukan.'], 404);
        }

        return response()->json($readingProgress);
    }
}
