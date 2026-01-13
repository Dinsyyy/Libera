<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Book;
use App\Models\BorrowTransaction;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use App\Notifications\LibraryNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class TransactionController extends Controller
{
    public function borrowBook(Request $request, string $id): JsonResponse
    {
        $user = Auth::user();

        $request->validate([
            'duration_days' => 'required|integer|in:7,14',
        ]);

        $existingLoan = BorrowTransaction::where('user_id', $user->id)
            ->where('book_id', $id)
            ->where('status', 'dipinjam')
            ->exists();

        if ($existingLoan) {
            return response()->json(['message' => 'Anda sudah meminjam buku ini dan belum mengembalikannya.'], 422);
        }

        try {
            $transaction = DB::transaction(function () use ($user, $id, $request) {
                $book = Book::where('id', $id)->lockForUpdate()->firstOrFail();
                if ($book->stock <= 0) {
                    throw new \Exception('Stok buku telah habis.');
                }
                $book->stock = $book->stock - 1;
                $book->save();
                $borrowDate = Carbon::now();
                $dueDate = $borrowDate->copy()->addDays($request->input('duration_days', 7));
                $newTransaction = BorrowTransaction::create([
                    'user_id' => $user->id,
                    'book_id' => $book->id,
                    'borrow_date' => $borrowDate->toDateString(),
                    'due_date' => $dueDate->toDateString(),
                    'status' => 'dipinjam',
                ]);

                return $newTransaction;
            });

            return response()->json([
                'message' => 'Peminjaman berhasil!',
                'transaction' => $transaction,
            ], 201);

        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }

    public function myTransactions(): JsonResponse
    {
        $user = Auth::user();
        $transactions = BorrowTransaction::where('user_id', $user->id)
            ->with('book')
            ->latest()
            ->get();

        return response()->json($transactions, 200);
    }

    public function returnBook($id)
    {
        $user = Auth::user();
        try {
            $transaction = DB::transaction(function () use ($user, $id) {
                $transaction = BorrowTransaction::where('id', $id)
                    ->where('user_id', $user->id)
                    ->where('status', 'dipinjam')
                    ->firstOrFail();

                $transaction->update([
                    'return_date' => Carbon::now(),
                    'status' => 'dikembalikan',
                ]);
                $transaction->book->increment('stock');
                $user->notify(new LibraryNotification(
                    "Terima kasih! Buku '{$transaction->book->title}' telah berhasil dikembalikan."
                ));

                return $transaction;
            });

            return response()->json(['message' => 'Buku berhasil dikembalikan.', 'transaction' => $transaction]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Gagal memproses pengembalian atau transaksi tidak ditemukan.'], 422);
        }
    }
}
