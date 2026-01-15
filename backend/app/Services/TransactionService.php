<?php

namespace App\Services;

use App\Models\Book;
use App\Models\BorrowTransaction;
use App\Models\User;
use App\Notifications\LibraryNotification;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Exception;

class TransactionService
{
    /**
     * Handle the business logic for borrowing a book.
     *
     * @param User $user
     * @param string $bookId
     * @param int $durationDays
     * @return BorrowTransaction
     * @throws Exception
     */
    public function borrowBook(User $user, string $bookId, int $durationDays): BorrowTransaction
    {
        $existingLoan = BorrowTransaction::where('user_id', $user->id)
            ->where('book_id', $bookId)
            ->where('status', 'dipinjam')
            ->exists();

        if ($existingLoan) {
            throw new Exception('Anda sudah meminjam buku ini dan belum mengembalikannya.');
        }

        return DB::transaction(function () use ($user, $bookId, $durationDays) {
            $book = Book::where('id', $bookId)->lockForUpdate()->firstOrFail();

            if ($book->stock <= 0) {
                throw new Exception('Stok buku telah habis.');
            }

            $book->stock -= 1;
            $book->save();

            $borrowDate = Carbon::now();
            $dueDate = $borrowDate->copy()->addDays($durationDays);

            return BorrowTransaction::create([
                'user_id' => $user->id,
                'book_id' => $book->id,
                'borrow_date' => $borrowDate->toDateString(),
                'due_date' => $dueDate->toDateString(),
                'status' => 'dipinjam',
            ]);
        });
    }

    /**
     * Handle the business logic for returning a book.
     *
     * @param User $user
     * @param string $transactionId
     * @return BorrowTransaction
     * @throws Exception
     */
    public function returnBook(User $user, string $transactionId): BorrowTransaction
    {
        return DB::transaction(function () use ($user, $transactionId) {
            $transaction = BorrowTransaction::where('id', $transactionId)
                ->where('user_id', $user->id)
                ->where('status', 'dipinjam')
                ->firstOrFail();

            $returnDate = Carbon::now();
            $fineAmount = 0;
            $finePerDay = 1000; // Rp 1.000 per day

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
    }
}
