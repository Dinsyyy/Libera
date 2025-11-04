<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Book; // <-- Import Model
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class AdminBookController extends Controller
{
    /**
     * Menyimpan buku baru. (CREATE)
     * POST /api/admin/books
     */
    public function store(Request $request): JsonResponse
    {
        // Validasi input
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

        return response()->json($book, 201); // 201 = Created
    }

    /**
     * Mengupdate data buku. (UPDATE)
     * PUT /api/admin/books/{id}
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $book = Book::findOrFail($id);

        $validatedData = $request->validate([
            'title' => 'required|string|max:255',
            'author' => 'required|string|max:255',
            'publisher' => 'nullable|string',
            'publication_year' => 'nullable|string|max:4',
            // 'unique' di-ignore jika ID-nya sama dengan ID buku ini
            'isbn' => 'nullable|string|unique:books,isbn,' . $book->id,
            'stock' => 'required|integer|min:0',
            'synopsis' => 'nullable|string',
            'cover_image_url' => 'nullable|string|url',
        ]);

        $book->update($validatedData);

        return response()->json($book, 200); // 200 = OK
    }

    /**
     * Menghapus buku. (DELETE)
     * DELETE /api/admin/books/{id}
     */
    public function destroy(string $id): JsonResponse
    {
        $book = Book::findOrFail($id);
        $book->delete();

        // Beri respons 'No Content' (sukses tapi tidak ada body)
        return response()->json(null, 204); 
    }
}