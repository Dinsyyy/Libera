<?php

namespace Tests\Feature;

use App\Models\Admin;
use App\Models\Book;
use App\Models\BorrowTransaction;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminTransactionTest extends TestCase
{
    use RefreshDatabase;

    protected $admin;
    protected $user;
    protected $book;

    protected function setUp(): void
    {
        parent::setUp();
        $this->admin = User::factory()->create(['role' => 'admin']);
        $this->user = User::factory()->create(['role' => 'user']);
        $this->book = Book::factory()->create(['stock' => 10]);
    }

    public function test_admin_can_create_borrow_transaction()
    {
        $response = $this->actingAs($this->admin)->postJson('/api/admin/transactions', [
            'user_id' => $this->user->id,
            'book_id' => $this->book->id,
            'due_date' => now()->addDays(7)->toDateString(),
        ]);

        $response->assertStatus(201)
            ->assertJsonFragment(['message' => 'Peminjaman berhasil dicatat.']);

        $this->assertDatabaseHas('borrow_transactions', [
            'user_id' => $this->user->id,
            'book_id' => $this->book->id,
            'status' => 'dipinjam',
        ]);

        $this->assertDatabaseHas('books', [
            'id' => $this->book->id,
            'stock' => 9,
        ]);
    }

    public function test_admin_can_return_book()
    {
        $transaction = BorrowTransaction::create([
            'user_id' => $this->user->id,
            'book_id' => $this->book->id,
            'borrow_date' => now(),
            'due_date' => now()->addDays(7),
            'status' => 'dipinjam',
        ]);

        $response = $this->actingAs($this->admin)->postJson("/api/admin/transactions/{$transaction->id}/return");

        $response->assertStatus(200)
            ->assertJsonFragment(['message' => 'Buku berhasil dikembalikan.']);

        $this->assertDatabaseHas('borrow_transactions', [
            'id' => $transaction->id,
            'status' => 'dikembalikan',
        ]);
    }

    public function test_admin_can_view_all_transactions()
    {
        BorrowTransaction::factory()->count(5)->create();

        $response = $this->actingAs($this->admin)->getJson('/api/admin/transactions');

        $response->assertStatus(200)
            ->assertJsonCount(5, 'data');
    }

    public function test_admin_can_view_active_loans()
    {
        BorrowTransaction::factory()->count(3)->create(['status' => 'dipinjam']);
        BorrowTransaction::factory()->count(2)->create(['status' => 'dikembalikan']);

        $response = $this->actingAs($this->admin)->getJson('/api/admin/active-loans');

        $response->assertStatus(200)
            ->assertJsonCount(3, 'data');
    }
}
