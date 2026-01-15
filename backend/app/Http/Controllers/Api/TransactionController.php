<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BorrowTransaction;
use App\Services\TransactionService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TransactionController extends Controller
{
    protected $transactionService;

    public function __construct(TransactionService $transactionService)
    {
        $this->transactionService = $transactionService;
    }

    public function borrowBook(Request $request, string $id): JsonResponse
    {
        $request->validate([
            'duration_days' => 'required|integer|in:7,14',
        ]);

        try {
            $transaction = $this->transactionService->borrowBook(
                Auth::user(),
                $id,
                $request->input('duration_days')
            );

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

    public function returnBook($id): JsonResponse
    {
        try {
            $transaction = $this->transactionService->returnBook(Auth::user(), $id);
            return response()->json(['message' => 'Buku berhasil dikembalikan.', 'transaction' => $transaction]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Gagal memproses pengembalian atau transaksi tidak ditemukan.'], 422);
        }
    }
}
