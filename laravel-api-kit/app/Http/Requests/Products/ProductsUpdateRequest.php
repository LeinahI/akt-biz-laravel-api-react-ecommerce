<?php

namespace App\Http\Requests\Products;

use Illuminate\Foundation\Http\FormRequest;
use App\Helpers\Products\ProductCategoryJSONHelper;

class ProductsUpdateRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $prefix = 'update_'; // Prefix for all fields in the update request
        return [
            $prefix . 'name' => ['required', 'string', 'max:255', 'min:2'],
            $prefix . 'brand' => ['required', 'string', 'max:255', 'min:2'],
            $prefix . 'price' => ['required', 'numeric', 'min:0'],
            $prefix . 'category' => ['required', ProductCategoryJSONHelper::getAllProductCategory('value')],
            $prefix . 'stock_quantity' => ['required', 'integer', 'min:0'],
        ];
    }
}
