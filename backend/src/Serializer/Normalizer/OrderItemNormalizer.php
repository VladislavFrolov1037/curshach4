<?php

namespace App\Serializer\Normalizer;

use App\Entity\OrderItem;
use Symfony\Component\Serializer\Normalizer\NormalizerAwareInterface;
use Symfony\Component\Serializer\Normalizer\NormalizerAwareTrait;
use Symfony\Component\Serializer\Normalizer\NormalizerInterface;
use Symfony\Contracts\Translation\TranslatorInterface;

class OrderItemNormalizer implements NormalizerInterface, NormalizerAwareInterface
{
    use NormalizerAwareTrait;

    public function __construct(private TranslatorInterface $translator)
    {
    }

    public function supportsNormalization($data, ?string $format = null, array $context = []): bool
    {
        return $data instanceof OrderItem;
    }

    public function normalize($object, ?string $format = null, array $context = []): array
    {
        return [
            'id' => $object->getId(),
            'quantity' => $object->getQuantity(),
            'price' => $object->getPrice(),
            'product' => $this->normalizer->normalize($object->getProduct()),
        ];
    }

    public function getSupportedTypes(?string $format): array
    {
        return [
            OrderItem::class => true,
        ];
    }
}
