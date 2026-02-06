<?php

namespace Database\Factories\Products;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Helpers\Products\ProductCategoryJSONHelper;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Products\ProductsModel>
 */
class ProductsModelFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => auth()->id(), /* Default to user_id 1 if no authenticated user (e.g. during seeding) */
            'name' => $this->faker->word(),
            'brand' => $this->faker->company(),
            'price' => $this->faker->randomFloat(2, 1, 100),
            'category' => $this->faker->randomElement(explode(',', ProductCategoryJSONHelper::getAllProductCategory('value'))),
            'stock_quantity' => $this->faker->numberBetween(1, 100),
        ];
    }
}
