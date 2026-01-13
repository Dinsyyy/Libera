<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Book extends Model
{
    use HasFactory;

    /**
     * Kolom yang boleh diisi secara massal (mass assignable).
     */
    protected $fillable = [
        'title',
        'author',
        'category',
        'publisher',
        'publication_year',
        'isbn',
        'stock',
        'synopsis',
        'cover_image_url',
        'total_pages',
        'average_rating',
        'total_reviews',
    ];

    /**
     * Mendefinisikan relasi: Satu Buku (Book) bisa memiliki
     * banyak Transaksi Peminjaman (BorrowTransaction).
     */
    public function transactions(): HasMany
    {
        return $this->hasMany(BorrowTransaction::class);
    }

    /**
     * Mendefinisikan relasi: Satu Buku (Book) bisa memiliki
     * banyak Progres Membaca (ReadingProgress).
     */
    public function readingProgress(): HasMany
    {
        return $this->hasMany(ReadingProgress::class);
    }

    /**
     * Mendefinisikan relasi: Satu Buku (Book) bisa memiliki
     * banyak Ulasan (Review).
     */
    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }
}
