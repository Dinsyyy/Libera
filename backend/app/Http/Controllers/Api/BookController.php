<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Book;
use Illuminate\Http\JsonResponse;

class BookController extends Controller
{
    public function index(): JsonResponse
    {
        $books = Book::latest()->paginate(10);

        return response()->json($books, 200);
    }

    public function show(string $id): JsonResponse
    {
        $book = Book::findOrFail($id);

        return response()->json($book, 200);
    }
}
