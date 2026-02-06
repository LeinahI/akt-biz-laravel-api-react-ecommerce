<?php

namespace App\Http\Resources\Products;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\UserResource;

class ProductsResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'product_id' => $this->product_id,
            'user_id' => new UserResource($this->whenLoaded('user')),  // $this->user_id
            'name' => $this->name,
            'brand' => $this->brand,
            'price' => $this->price,
            'category' => $this->category,
            'stock_quantity' => $this->stock_quantity,
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
