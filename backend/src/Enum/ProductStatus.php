<?php

namespace App\Enum;

enum ProductStatus: string
{
    public const STATUS_AVAILABLE = 'available';
    public const STATUS_OUT_OF_STOCK = 'out_of_stock';
    public const STATUS_DISCONTINUED = 'discontinued';
    public const STATUS_REMOVED = 'removed';
}