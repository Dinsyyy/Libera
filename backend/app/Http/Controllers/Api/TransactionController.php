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

                $returnDate = Carbon::now();
                $fineAmount = 0;
                $finePerDay = 1000; // Rp 1.000 per day

                // Calculate fine if returned late
                $dueDate = Carbon::parse($transaction->due_date);
                if ($returnDate->greaterThan($dueDate)) {
                    $daysOverdue = $returnDate->diffInDays($dueDate);
                    $fineAmount = $daysOverdue * $finePerDay;
                }

                $transaction->update([
                    'return_date' => $returnDate,
                    'status' => 'dikembalikan',
                    'fine_amount' => $fineAmount,
                    'fine_paid_at' => null, // Fine is incurred but not yet paid
                ]);
                $transaction->book->increment('stock');

                $notificationMessage = "Terima kasih! Buku '{$transaction->book->title}' telah berhasil dikembalikan.";
                if ($fineAmount > 0) {
                    $notificationMessage .= " Anda dikenakan denda sebesar Rp " . number_format($fineAmount, 0, ',', '.');
                }
                $user->notify(new LibraryNotification($notificationMessage));

                return $transaction;
            });

            return response()->json(['message' => 'Buku berhasil dikembalikan.', 'transaction' => $transaction]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Gagal memproses pengembalian atau transaksi tidak ditemukan.'], 422);
        }
    }
}
