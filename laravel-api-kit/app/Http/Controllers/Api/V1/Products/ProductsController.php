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
        $productsQuery = QueryBuilder::for(ProductsModel::class)
            ->allowedFilters(['name', 'brand', 'category']) // Allow clients to filter results by 'name', 'brand', or 'category' fields via query parameters
            ->allowedSorts(['stock_quantity', 'price', 'updated_at'])  // Allow clients to sort results by 'stock_quantity', 'price', or 'updated_at' fields via query parameters
            ->orderBy('updated_at', 'desc') // sort by descending order
            ->paginate(5);

        /* Refactored for efficiency
        Because the previous code does have ->get() (which fetches ALL rows into PHP memory)
        and then paginates manually. The indexes help the db, but you're still loading everything into memory.
        Thus, we can just paginate quickly and then transform the paginated collection, which is much more efficient. 
        The indexes will still be used for filtering/sorting, but we won't load all rows into memory at once.
        */
        $productsQuery->getCollection()->transform(function ($product) {
            return new ProductsResource($product->load('user'));
        });

        return $this->success($productsQuery);
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
