<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Book;
use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class ReviewController extends Controller
{
    public function store(Request $request)
    {
        $user = Auth::user();

        $validated = $request->validate([
            'book_id' => 'required|exists:books,id',
            'rating' => ['required', 'integer', 'min:1', 'max:5'],
            'comment' => 'nullable|string|max:1000',
        ]);

        $review = Review::updateOrCreate(
            [
                'user_id' => $user->id,
                'book_id' => $validated['book_id'],
            ],
            [
                'rating' => $validated['rating'],
                'comment' => $validated['comment'],
            ]
        );

        $this->calculateAverageRating($validated['book_id']);

        return response()->json([
            'message' => 'Ulasan berhasil disimpan!',
            'review' => $review->load('user'),
        ], 200);
    }

    public function index(string $book_id)
    {
        $reviews = Review::where('book_id', $book_id)
            ->with('user:id,name') // Load user data, but only id and name
            ->latest()
            ->get();

        return response()->json($reviews);
    }

    /**
     * Calculate and update average rating for a book.
     */
    public function calculateAverageRating(int $bookId)
    {
        $book = Book::find($bookId);
        if ($book) {
            $averageRating = $book->reviews()->avg('rating');
            $totalReviews = $book->reviews()->count();

            $book->average_rating = round($averageRating, 2);
            $book->total_reviews = $totalReviews;
            $book->save();
        }
    }
}
