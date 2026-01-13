<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BorrowTransaction extends Model
{
    use HasFactory;

    /**
     * Kolom yang boleh diisi secara massal.
     */
    protected $fillable = [
        'user_id',
        'book_id',
        'borrow_date',
        'due_date',
        'return_date',
        'return_date',
        'status',
        'fine_amount',
        'fine_paid_at',
        'fine_waived_at',
    ];

    /**
     * Mendefinisikan relasi: Satu Transaksi (BorrowTransaction)
     * dimiliki oleh satu Pengguna (User).
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Mendefinisikan relasi: Satu Transaksi (BorrowTransaction)
     * dimiliki oleh satu Buku (Book).
     */
    public function book(): BelongsTo
    {
        return $this->belongsTo(Book::class);
    }
}
