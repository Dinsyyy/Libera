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
        Schema::table('borrow_transactions', function (Blueprint $table) {
            $table->decimal('fine_amount', 10, 2)->default(0)->after('status');
            $table->timestamp('fine_paid_at')->nullable()->after('fine_amount');
            $table->timestamp('fine_waived_at')->nullable()->after('fine_paid_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('borrow_transactions', function (Blueprint $table) {
            $table->dropColumn(['fine_amount', 'fine_paid_at', 'fine_waived_at']);
        });
    }
};
