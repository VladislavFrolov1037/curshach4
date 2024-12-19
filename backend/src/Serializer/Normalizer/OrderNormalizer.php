<?php

namespace App\Serializer\Normalizer;

use App\Entity\Order;
use Symfony\Component\Serializer\Normalizer\NormalizerAwareInterface;
use Symfony\Component\Serializer\Normalizer\NormalizerAwareTrait;
use Symfony\Component\Serializer\Normalizer\NormalizerInterface;

class OrderNormalizer implements NormalizerInterface, NormalizerAwareInterface
{
    use NormalizerAwareTrait;

    public function supportsNormalization($data, ?string $format = null, array $context = []): bool
    {
        return $data instanceof Order;
    }

    public function normalize($object, ?string $format = null, array $context = []): array
    {
        return [
            'id' => $object->getId(),
            'totalPrice' => $object->getTotalPrice(),
            'status' => $object->getStatus(),
            'shippingAddress' => $object->getShippingAddress(),
            'createdAt' => $object->getCreatedAt()->format('Y-m-d H:i:s'),
            'orderItems' => array_map(function ($orderItem) {
                return [
                    'orderItem' => $this->normalizer->normalize($orderItem),
                ];
            }, $object->getOrderItems()->toArray()),
            'user' => $this->normalizer->normalize($object->getUser()),
        ];
    }

    public function getSupportedTypes(?string $format): array
    {
        return [
            Order::class => true,
        ];
    }
}
