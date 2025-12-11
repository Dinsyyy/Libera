<?php

namespace Database\Factories;

use App\Models\Book;
use App\Models\BorrowTransaction;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class BorrowTransactionFactory extends Factory
{
    protected $model = BorrowTransaction::class;

    public function definition()
    {
        return [
            'user_id' => User::factory(),
            'book_id' => Book::factory(),
            'borrow_date' => $this->faker->dateTimeBetween('-1 month', 'now'),
            'due_date' => $this->faker->dateTimeBetween('now', '+1 month'),
            'return_date' => null,
            'status' => 'dipinjam',
        ];
    }
}
