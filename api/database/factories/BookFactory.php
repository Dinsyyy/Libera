<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Book>
 */
class BookFactory extends Factory
{
/**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'title' => $this->faker->sentence(3), // Judul (3 kata)
            'author' => $this->faker->name(),     // Nama penulis
            'publisher' => $this->faker->company(), // Nama penerbit
            'publication_year' => $this->faker->year(),
            'isbn' => $this->faker->unique()->isbn13(), // ISBN unik
            'stock' => $this->faker->numberBetween(1, 20), // Stok antara 1-20
            'synopsis' => $this->faker->paragraph(3), // Sinopsis (3 paragraf)
            'cover_image_url' => 'https://via.placeholder.com/400x600.png?text=LiberaBook', // Gambar placeholder
        ];
    }
}
