<?php

namespace App\Models;

// Import-import yang diperlukan
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens; // <-- INI YANG PENTING
use Illuminate\Database\Eloquent\Relations\HasMany; // Ini dari langkah kita sebelumnya

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
}