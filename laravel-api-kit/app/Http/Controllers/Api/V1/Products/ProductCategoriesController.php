<?php

namespace App\Http\Controllers\Api\V1\Products;

use App\Http\Controllers\Api\ApiController;
use App\Helpers\Products\ProductCategoryJSONHelper;

class ProductCategoriesController extends ApiController
{
    public function index()
    {
        // Load product categories from JSON helper
        $categories = ProductCategoryJSONHelper::loadProductCategory() ?? []; // Get the 'value' field from the JSON data, or return an empty array if not found
        return $this->success($categories); // Return the product categories wrapped in success response
    }
}
