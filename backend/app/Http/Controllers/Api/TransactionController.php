<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Book;
use App\Models\BorrowTransaction;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class TransactionController extends Controller
{
    public function borrowBook(string $id): JsonResponse
    {
        $user = Auth::user();

        try {
            $transaction = DB::transaction(function () use ($user, $id) {
                $book = Book::where('id', $id)->lockForUpdate()->firstOrFail();
                if ($book->stock <= 0) {
                    throw new \Exception('Stok buku telah habis.');
                }
                $book->stock = $book->stock - 1;
                $book->save();
                $borrowDate = Carbon::now();
                $dueDate = $borrowDate->copy()->addDays(7);
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
}
