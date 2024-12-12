<?php

namespace App\Serializer\Normalizer;

use App\Entity\CartItem;
use Symfony\Component\Serializer\Normalizer\NormalizerInterface;

class CartItemNormalizer implements NormalizerInterface
{
    public function supportsNormalization($data, ?string $format = null, array $context = []): bool
    {
        return $data instanceof CartItem;
    }

    public function normalize($object, ?string $format = null, array $context = []): array
    {
        return [
            'id' => $object->getId(),
            'quantity' => $object->getTotalPrice(),
            'price' => $object->getUser(),
            'cartId' => $object->getCart()->getId(),
            'product' => $object->getProduct(),
        ];
    }

    public function getSupportedTypes(?string $format): array
    {
        return [
            CartItem::class => true,
        ];
    }
}
