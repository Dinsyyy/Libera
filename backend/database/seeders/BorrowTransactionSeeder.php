<?php

namespace Database\Seeders;

use App\Models\Book;
use App\Models\BorrowTransaction;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class BorrowTransactionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('borrow_transactions')->truncate(); // Clear table before seeding

        $user = User::first(); // Get the first user
        $books = Book::all(); // Get all books

        if (!$user || $books->isEmpty()) {
            echo "Skipping BorrowTransactionSeeder: No users or books found.\n";
            return;
        }

        $borrowedBooks = $books->random(min(5, $books->count())); // Get 5 random books

        foreach ($borrowedBooks as $index => $book) {
            $borrowDate = Carbon::now()->subDays(rand(10, 30)); // Make borrow dates older
            $dueDate = $borrowDate->copy()->addDays(7);
            $status = ($index % 2 == 0) ? 'dipinjam' : 'dikembalikan';
            $returnDate = null;
            $fineAmount = 0;
            $finePaidAt = null;

            if ($status == 'dikembalikan') {
                $returnDate = $dueDate->copy()->addDays(rand(0, 10)); // Some returned late
                if ($returnDate->greaterThan($dueDate)) {
                    $daysOverdue = $returnDate->diffInDays($dueDate);
                    $fineAmount = $daysOverdue * 1000; // Rp 1.000 per day
                    if ($index % 3 == 0) { // Some fines paid
                        $finePaidAt = $returnDate->copy()->addDays(rand(1, 3));
                    }
                }
            }

            BorrowTransaction::create([
                'user_id' => $user->id,
                'book_id' => $book->id,
                'borrow_date' => $borrowDate->toDateString(),
                'due_date' => $dueDate->toDateString(),
                'status' => $status,
                'return_date' => $returnDate?->toDateString(),
                'fine_amount' => $fineAmount,
                'fine_paid_at' => $finePaidAt?->toDateTimeString(),
            ]);
        }

        echo "Seeded " . $borrowedBooks->count() . " sample borrow transactions.\n";
    }
}
