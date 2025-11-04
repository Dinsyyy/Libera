<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
/**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('borrow_transactions', function (Blueprint $table) {
            $table->id();
            
            // Kunci asing ke tabel 'users'
            // Jika user dihapus, transaksinya juga terhapus (cascade)
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            
            // Kunci asing ke tabel 'books'
            $table->foreignId('book_id')->constrained('books')->onDelete('cascade');
            
            $table->date('borrow_date');      // Tanggal pinjam
            $table->date('due_date');         // Tanggal harus kembali
            $table->date('return_date')->nullable(); // Tanggal aktual kembali (bisa null)
            
            // Status untuk melacak buku masih dipinjam atau sudah kembali
            $table->enum('status', ['dipinjam', 'dikembalikan'])->default('dipinjam');
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('borrow_transactions');
    }
};
