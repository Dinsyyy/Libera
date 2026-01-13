<?php

namespace App\Models;

// Import-import yang diperlukan
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable; // <-- INI YANG PENTING
use Laravel\Sanctum\HasApiTokens; // Ini dari langkah kita sebelumnya

class User extends Authenticatable
{
    // Trait (alat bantu) yang digunakan
    use HasApiTokens, HasFactory, Notifiable; // <-- PASTIKAN HasApiTokens ADA DI SINI

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role', // Ini dari langkah kita sebelumnya
        'profile_photo_path',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        // Jika Anda menggunakan Laravel 11+, baris ini mungkin sudah ada
        // 'password' => 'hashed',
    ];

    /**
     * Relasi ke Transaksi Peminjaman
     */
    public function transactions(): HasMany
    {
        return $this->hasMany(BorrowTransaction::class);
    }

    /**
     * Relasi ke Progres Membaca
     */
    public function readingProgress(): HasMany
    {
        return $this->hasMany(ReadingProgress::class);
    }

    /**
     * Relasi ke Ulasan Buku
     */
    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }

    /**
     * Relasi ke Sumbangan Buku
     */
    public function donations(): HasMany
    {
        return $this->hasMany(Donation::class);
    }
}
