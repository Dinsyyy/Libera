<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Book;

class PublicBookController extends Controller
{
    public function index()
    {
        $books = Book::latest()->get();

        return response()->json([
            'message' => 'List buku berhasil diambil',
            'data' => $books,
        ]);
    }

    public function show($id)
    {
        $book = Book::find($id);

        if (! $book) {
            return response()->json(['message' => 'Buku tidak ditemukan'], 404);
        }

        return response()->json([
            'message' => 'Detail buku berhasil diambil',
            'data' => $book,
        ]);
    }
}
