<?php

namespace App\Policies\Products;

use App\Models\User;
use App\Models\Products\ProductsModel;
use Illuminate\Auth\Access\Response;

class ProductsPolicy
{
    /**
     * Create a new policy instance.
     */
   public function modify(User $user, ProductsModel $product): Response
    {
        return $user->user_id === $product->user_id
            ? Response::allow()
            : Response::deny('You do not own this product to modify this.');
    }
}
