<?php

namespace App\Helpers\Products;

use Illuminate\Support\Facades\File;

class ProductCategoryJSONHelper
{

    public static function loadProductCategory()
    {
        $path = base_path('config/constants/products/product_category.json');
        $json = File::get($path);
        return json_decode($json, true);
    }

    public static function getAllProductCategory($returnType = "key")
    {
        $productCategory = self::loadProductCategory();
        if ($returnType === "key") {
            return implode(',', array_keys($productCategory['productCategory']));
        } elseif ($returnType === "value") {
            return implode(',', array_values($productCategory['productCategory']));
        }
        // Default to returning keys
        return implode(',', array_keys($productCategory['productCategory']));
    }
}
