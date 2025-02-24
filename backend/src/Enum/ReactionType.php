<?php

namespace App\Enum;

enum ReactionType: string
{
    case TYPE_LIKE = 'like';
    case TYPE_DISLIKE = 'dislike';
}