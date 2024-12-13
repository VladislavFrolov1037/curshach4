<?php

namespace App\Serializer\Normalizer;

use App\Entity\CartItem;
use Symfony\Component\Serializer\Normalizer\NormalizerAwareInterface;
use Symfony\Component\Serializer\Normalizer\NormalizerAwareTrait;
use Symfony\Component\Serializer\Normalizer\NormalizerInterface;

class CartItemNormalizer implements NormalizerInterface, NormalizerAwareInterface
{
    use NormalizerAwareTrait;

    public function supportsNormalization($data, ?string $format = null, array $context = []): bool
    {
        return $data instanceof CartItem;
    }

    public function normalize($object, ?string $format = null, array $context = []): array
    {
        return [
            'id' => $object->getId(),
            'quantity' => $object->getQuantity(),
            'price' => $object->getPrice(),
            'cartId' => $object->getCart()->getId(),
            'product' => $this->normalizer->normalize($object->getProduct()),
        ];
    }

    public function getSupportedTypes(?string $format): array
    {
        return [
            CartItem::class => true,
        ];
    }
}
