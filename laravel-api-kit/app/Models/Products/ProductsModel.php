<?php

namespace App\Models\Products;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Database\Factories\Products\ProductsModelFactory;
use App\Models\User as UserModel;

class ProductsModel extends Model
{

    /** @use HasFactory<ProductsModelFactory> */
    use HasFactory;
    protected $table = 'products';
    protected $primaryKey = 'product_id';

    protected $fillable = [
        'name', /* text */
        'user_id',
        'brand', /* text */
        'price', /* decimal 8,2  */
        'category', /* text */
        'stock_quantity', /* integer */
    ];

    protected $casts = [

        'price' => 'decimal:2',
        'stock_quantity' => 'integer',
    ];

        public function user()
    {
        return $this->belongsTo(UserModel::class, 'user_id', 'id');
    }
}
