<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\BorrowTransaction;
use App\Models\Book; // <-- Import Book
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;   // <-- Import DB
use Carbon\Carbon; // <-- Import Carbon

class AdminTransactionController extends Controller
{
    /**
     * Menampilkan daftar SEMUA transaksi yang sedang aktif (status 'dipinjam').
     * GET /api/admin/transactions
     */
    public function index(): JsonResponse
    {
        // Ambil semua transaksi yang masih 'dipinjam'
        // 'with' akan mengambil data user dan data buku yang terkait
        $activeTransactions = BorrowTransaction::where('status', 'dipinjam')
                                ->with(['user', 'book']) // Ambil data user & buku
                                ->latest()
                                ->get();

        return response()->json($activeTransactions, 200);
    }

    /**
     * Mengembalikan buku (hanya bisa dilakukan oleh Admin).
     * POST /api/admin/transactions/{id}/return
     */
    public function returnBook(string $id): JsonResponse
    {
        try {
            $transaction = DB::transaction(function () use ($id) {
                // Cari transaksi berdasarkan ID, dan 'lock'
                $transaction = BorrowTransaction::where('id', $id)
                                    ->lockForUpdate()
                                    ->firstOrFail();

                // 1. Cek apakah buku sudah dikembalikan
                if ($transaction->status === 'dikembalikan') {
                    throw new \Exception('Buku ini sudah dikembalikan.');
                }

                // 2. Update status transaksi
                $transaction->status = 'dikembalikan';
                $transaction->return_date = Carbon::now()->toDateString();
                $transaction->save();

                // 3. Tambah stok buku kembali
                // 'lockForUpdate' di sini untuk keamanan data
                $book = Book::where('id', $transaction->book_id)
                            ->lockForUpdate()
                            ->firstOrFail();
                
                $book->stock = $book->stock + 1;
                $book->save();

                return $transaction;
            });

            // 4. Beri respons sukses
            return response()->json([
                'message' => 'Buku berhasil dikembalikan.',
                'transaction' => $transaction
            ], 200); // 200 = OK

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            // Jika transaksi tidak ditemukan
            return response()->json(['message' => 'Transaksi tidak ditemukan.'], 404);
        } catch (\Exception $e) {
            // Tangkap error lain (misal: sudah dikembalikan)
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }
}