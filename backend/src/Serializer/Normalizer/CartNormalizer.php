<?php

namespace App\Serializer\Normalizer;

use App\Entity\Cart;
use Symfony\Component\Serializer\Normalizer\NormalizerAwareInterface;
use Symfony\Component\Serializer\Normalizer\NormalizerAwareTrait;
use Symfony\Component\Serializer\Normalizer\NormalizerInterface;

class CartNormalizer implements NormalizerInterface, NormalizerAwareInterface
{
    use NormalizerAwareTrait;

    public function supportsNormalization($data, ?string $format = null, array $context = []): bool
    {
        return $data instanceof Cart;
    }

    public function normalize($object, ?string $format = null, array $context = []): array
    {
        return [
            'id' => $object->getId(),
            'totalPrice' => $object->getTotalPrice(),
            'cartItems' => array_map(
                fn ($cartItem) => [
                    'id' => $cartItem->getId(),
                    'quantity' => $cartItem->getQuantity(),
                    'price' => $cartItem->getPrice(),
                    'product' => $this->normalizer->normalize($cartItem->getProduct()),
                ], $object->getCartItems()->toArray()),
        ];
    }

    public function getSupportedTypes(?string $format): array
    {
        return [
            Cart::class => true,
        ];
    }
}
