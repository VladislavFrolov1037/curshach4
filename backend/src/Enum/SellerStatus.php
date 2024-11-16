<?php

namespace App\Enum;

enum SellerStatus: string
{
    case PENDING = 'pending';
    case APPROVED = 'approved';
    case REJECTED = 'rejected';
    case INACTIVE = 'inactive';
}
