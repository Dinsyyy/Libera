<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Book;
use App\Models\BorrowTransaction;
use App\Models\User;
use App\Notifications\LibraryNotification;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminTransactionController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'book_id' => 'required|exists:books,id',
            'due_date' => 'required|date|after:today',
        ]);

        $book = Book::findOrFail($request->book_id);

        if ($book->stock < 1) {
            return response()->json(['message' => 'Stok buku habis.'], 400);
        }

        DB::beginTransaction();
        try {
            $book->decrement('stock');

            $transaction = BorrowTransaction::create([
                'user_id' => $request->user_id,
                'book_id' => $request->book_id,
                'borrow_date' => Carbon::now(),
                'due_date' => $request->due_date,
                'status' => 'dipinjam',
            ]);

            $user = User::find($request->user_id);
            $user->notify(new LibraryNotification(
                "Buku '{$book->title}' berhasil dipinjam. Harap kembalikan sebelum ".$request->due_date
            ));

            DB::commit();

            return response()->json([
                'message' => 'Peminjaman berhasil dicatat.',
                'data' => $transaction,
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json(['message' => 'Gagal mencatat transaksi.'], 500);
        }
    }

    public function index()
    {
        $transactions = BorrowTransaction::with(['user', 'book'])
            ->latest()
            ->paginate(10);

        return response()->json($transactions);
    }

    public function returnBook(Request $request, $id)
    {
        $transaction = BorrowTransaction::findOrFail($id);

        if ($transaction->status !== 'dipinjam') {
            return response()->json(['message' => 'Buku ini sudah dikembalikan sebelumnya.'], 400);
        }

        DB::beginTransaction();
        try {
            $transaction->update([
                'return_date' => Carbon::now(),
                'status' => 'dikembalikan',
            ]);

            $transaction->user->notify(new LibraryNotification(
                "Terima kasih! Buku '{$transaction->book->title}' telah berhasil dikembalikan."
            ));

            $transaction->book->increment('stock');

            DB::commit();

            return response()->json(['message' => 'Buku berhasil dikembalikan.']);

        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json(['message' => 'Gagal memproses pengembalian.'], 500);
        }
    }

    public function activeLoans()
    {
        $transactions = BorrowTransaction::with(['user', 'book'])
            ->where('status', 'dipinjam')
            ->latest()
            ->paginate(10);

        return response()->json($transactions);
    }
}
