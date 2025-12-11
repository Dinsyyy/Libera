<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Book;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminBookController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $validatedData = $request->validate([
            'title' => 'required|string|max:255',
            'author' => 'required|string|max:255',
            'publisher' => 'nullable|string',
            'publication_year' => 'nullable|string|max:4',
            'isbn' => 'nullable|string|unique:books',
            'stock' => 'required|integer|min:0',
            'synopsis' => 'nullable|string',
            'cover_image_url' => 'nullable|string|url',
        ]);

        $book = Book::create($validatedData);

        return response()->json($book, 201);
    }

    public function update(Request $request, string $id): JsonResponse
    {
        $book = Book::findOrFail($id);

        $validatedData = $request->validate([
            'title' => 'required|string|max:255',
            'author' => 'required|string|max:255',
            'publisher' => 'nullable|string',
            'publication_year' => 'nullable|string|max:4',
            'isbn' => 'nullable|string|unique:books,isbn,'.$book->id,
            'stock' => 'required|integer|min:0',
            'synopsis' => 'nullable|string',
            'cover_image_url' => 'nullable|string|url',
        ]);

        $book->update($validatedData);

        return response()->json($book, 200);
    }

    public function destroy(string $id): JsonResponse
    {
        $book = Book::findOrFail($id);
        $book->delete();

        return response()->json(null, 204);
    }
}
