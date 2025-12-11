<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('borrow_transactions', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');

            $table->foreignId('book_id')->constrained('books')->onDelete('cascade');

            $table->date('borrow_date');
            $table->date('due_date');
            $table->date('return_date')->nullable();

            $table->enum('status', ['dipinjam', 'dikembalikan'])->default('dipinjam');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('borrow_transactions');
    }
};
