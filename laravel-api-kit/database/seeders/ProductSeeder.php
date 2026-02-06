<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Products\ProductsModel;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;


final class ProductSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        ProductsModel::factory(10)->create();
    }
}
