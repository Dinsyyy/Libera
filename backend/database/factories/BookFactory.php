<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class BookFactory extends Factory
{
    public function definition(): array
    {
        return [
            'title' => $this->faker->sentence(3),
            'author' => $this->faker->name(),
            'publisher' => $this->faker->company(),
            'publication_year' => $this->faker->year(),
            'isbn' => $this->faker->unique()->isbn13(),
            'stock' => $this->faker->numberBetween(1, 20),
            'synopsis' => $this->faker->paragraph(3),
            'cover_image_url' => 'https://via.placeholder.com/400x600.png?text=LiberaBook',
        ];
    }
}
