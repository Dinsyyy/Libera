<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Book;
use App\Models\BorrowTransaction;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth; // <-- Import Auth
use Illuminate\Support\Facades\DB;   // <-- Import DB (PENTING untuk transaksi)
use Carbon\Carbon; // <-- Import Carbon untuk manipulasi tanggal

class TransactionController extends Controller
{
    /**
     * Meminjam buku. (Untuk User)
     * POST /api/books/{id}/borrow
     */
    public function borrowBook(string $id): JsonResponse
    {
        // 1. Dapatkan user yang sedang login
        $user = Auth::user();

        // 2. Gunakan DB::transaction
        // Ini memastikan bahwa jika salah satu query gagal (misal: stok gagal dikurangi),
        // query lainnya (pembuatan transaksi) akan dibatalkan.
        // Ini mencegah data "hantu" (stok berkurang tapi transaksi tidak tercatat).

        try {
            $transaction = DB::transaction(function () use ($user, $id) {
                // Cari buku, dan 'lockForUpdate' untuk mencegah race condition
                // (2 user meminjam buku terakhir di detik yang sama)
                $book = Book::where('id', $id)->lockForUpdate()->firstOrFail();

                // 3. Cek stok
                if ($book->stock <= 0) {
                    // 'throw' akan membatalkan transaksi DB
                    throw new \Exception('Stok buku telah habis.');
                }

                // 4. Kurangi stok
                $book->stock = $book->stock - 1;
                $book->save();

                // 5. Buat catatan transaksi
                $borrowDate = Carbon::now();
                $dueDate = $borrowDate->copy()->addDays(7); // Asumsi pinjam 7 hari

                $newTransaction = BorrowTransaction::create([
                    'user_id' => $user->id,
                    'book_id' => $book->id,
                    'borrow_date' => $borrowDate->toDateString(),
                    'due_date' => $dueDate->toDateString(),
                    'status' => 'dipinjam',
                ]);

                // 'return' akan memberi hasil jika sukses
                return $newTransaction;
            });

            // 6. Beri respons sukses
            return response()->json([
                'message' => 'Peminjaman berhasil!',
                'transaction' => $transaction
            ], 201); // 201 = Created

        } catch (\Exception $e) {
            // 7. Tangkap error (misal: stok habis)
            return response()->json(['message' => $e->getMessage()], 422); // 422 = Unprocessable Entity
        }
    }

    /**
     * Menampilkan riwayat peminjaman user yang sedang login. (Untuk User)
     * GET /api/my-transactions
     */
    public function myTransactions(): JsonResponse
    {
        $user = Auth::user();

        // Ambil transaksi milik user ini
        // 'with('book')' adalah "eager loading"
        // Ini akan mengambil data buku yang terhubung (dari relasi)
        // agar front-end tidak perlu query lagi
        $transactions = BorrowTransaction::where('user_id', $user->id)
                            ->with('book') // <-- Mengambil data dari Model Book
                            ->latest() // Urutkan dari yang terbaru
                            ->get();

        return response()->json($transactions, 200);
    }
}