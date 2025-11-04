<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Book; // <-- (A) Import Model Book
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse; // <-- (B) Import JsonResponse

class BookController extends Controller
{
    /**
     * Menampilkan daftar semua buku (Katalog).
     * Akan diakses via: GET /api/books
     */
    public function index(): JsonResponse
    {
        // Ambil semua buku, urutkan dari yang terbaru
        // Gunakan paginate() untuk memberi paginasi (misal: 10 buku per halaman)
        $books = Book::latest()->paginate(10);

        return response()->json($books, 200);
    }

    /**
     * Menampilkan detail satu buku.
     * Akan diakses via: GET /api/books/{id}
     */
    public function show(string $id): JsonResponse
    {
        // Cari buku berdasarkan ID. 
        // findOrFail() akan otomatis error 404 jika buku tidak ditemukan
        $book = Book::findOrFail($id);

        return response()->json($book, 200);
    }
}