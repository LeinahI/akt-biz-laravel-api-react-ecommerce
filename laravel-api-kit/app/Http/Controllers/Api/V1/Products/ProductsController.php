<?php

namespace App\Http\Controllers\Api\V1\Products;

use App\Http\Controllers\Api\ApiController;
use Illuminate\Http\Request;
use Spatie\QueryBuilder\QueryBuilder;
use App\Models\Products\ProductsModel;
use App\Http\Resources\Products\ProductsResource;
use Illuminate\Support\Facades\Gate;
use App\Http\Requests\Products\ProductsStoreRequest;
use App\Http\Requests\Products\ProductsUpdateRequest;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ProductsController extends ApiController
{
    public function index()
    {
        // Create a QueryBuilder instance for the ProductsModel
        $products = QueryBuilder::for(ProductsModel::class)
            ->allowedFilters(['name', 'brand', 'category']) // Allow clients to filter results by 'name', 'brand', or 'category' fields via query parameters
            ->allowedSorts(['stock_quantity', 'price', 'updated_at'])  // Allow clients to sort results by 'stock_quantity', 'price', or 'updated_at' fields via query parameters
            ->orderBy('updated_at', 'asc') // sort by ascending order
            ->paginate();  // Paginate the results (default 15 items per page, or customizable via per_page parameter)

        return $this->success(ProductsResource::collection($products->load('user'))); // Return the paginated products transformed through ProductsResource and wrapped in success response
    }

    public function show(ProductsModel $product)
    {
        return $this->success(new ProductsResource($product->load('user'))); // Return a single product transformed through ProductsResource, wrapped in success response
    }

    public function store(ProductsStoreRequest $request)
    {
        $validatedData = $request->validated();

        DB::beginTransaction();
        try {
            $product = ProductsModel::create([
                'user_id' => auth()->id(), /* Set user_id to the currently authenticated user's ID */
                'name' => $validatedData['store_name'],
                'brand' => $validatedData['store_brand'],
                'price' => $validatedData['store_price'],
                'category' => $validatedData['store_category'],
                'stock_quantity' => $validatedData['store_stock_quantity'],
            ]);

            // Commit the transaction
            DB::commit();

            return $this->success(new ProductsResource($product->load('user')), "Product stored successfully.");
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error Adding Product: ' . $e->getMessage(), ['error_request' => $request->all()]);
            return $this->error('Failed to add product.', 500);
        }
    }

    /* Use route model binding + policy (idiomatic and concise): */
    public function update(ProductsUpdateRequest $request, ProductsModel $product)
    {
        Gate::authorize('modify', $product);
        $validatedData = $request->validated();

        DB::beginTransaction();
        try {
            $product->update([
                'name' => $validatedData['update_name'],
                'brand' => $validatedData['update_brand'],
                'price' => $validatedData['update_price'],
                'category' => $validatedData['update_category'],
                'stock_quantity' => $validatedData['update_stock_quantity'],
            ]);

            // Commit the transaction
            DB::commit();

            return $this->success(new ProductsResource($product->load('user')), "Product updated successfully.");
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error Updating Product: ' . $e->getMessage(), ['error_request' => $request->all()]);
            return $this->error('Failed to update product.', 500);
        }
    }

    public function destroy(Request $request, ProductsModel $product)
    {
        Gate::authorize('modify', $product);
        DB::beginTransaction();
        try {
            $product->delete();
            DB::commit();

            return $this->success(new ProductsResource($product), "Product deleted successfully.");
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error Deleting Product: ' . $e->getMessage(), ['error_request' => $request->all()]);
            return $this->error('Failed to delete product.', 500);
        }
    }
}
