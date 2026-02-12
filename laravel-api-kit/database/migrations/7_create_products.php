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
        Schema::create('products', function (Blueprint $table): void {
            $table->id('product_id');
            $table->unsignedBigInteger('user_id');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade'); /* For Policy purposes that only same user_id can manage their products */
            /* 
            Note: text columns in MySQL cannot be directly indexed (unlimited length). 
            If you want to index name, brand, or category, change them to string (VARCHAR) instead and set a length to 255 */
            $table->string('name', 255);
            $table->string('brand', 255);
            $table->decimal('price', 8, 2);
            $table->string('category', 255); /* Enum validation using json but stored as string */
            $table->integer('stock_quantity');
            $table->timestamps();

            /* Indexes */
            // Single-column: speeds up filtering by user_id
            // Already partially handled by foreign key in your DB engine,
            //but adding an explicit index can improve performance for queries that filter by user_id.
            $table->index('user_id');

            // Single column indexes for common filters
            $table->index('category');       // WHERE category = ?
            $table->index('price');          // WHERE price BETWEEN ? AND ?
            $table->index('stock_quantity'); // WHERE stock_quantity > 0

            // Composite index: speeds up queries that filter by BOTH columns together
            $table->index(['category', 'price']); // WHERE category = ? AND price < ?
            $table->index(['stock_quantity', 'category']); // WHERE stock_quantity = ? AND category = ?
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
