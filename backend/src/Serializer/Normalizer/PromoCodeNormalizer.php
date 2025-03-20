<?php

namespace App\Serializer\Normalizer;

use App\Entity\PromoCode;
use Symfony\Component\Serializer\Normalizer\NormalizerInterface;

class PromoCodeNormalizer implements NormalizerInterface
{
    public function supportsNormalization($data, ?string $format = null, array $context = []): bool
    {
        return $data instanceof PromoCode;
    }

    public function normalize($object, ?string $format = null, array $context = []): array
    {
        return [
            'id' => $object->getId(),
            'code' => $object->getCode(),
            'discount' => $object->getDiscount(),
            'maxUses' => $object->getMaxUses(),
            'usedCount' => $object->getUsedCount(),
            'expiresAt' => $object->getExpiresAt()->format('d.m.Y'),
            'createdAt' => $object->getCreatedAt()->format('d.m.Y'),
        ];
    }

    public function getSupportedTypes(?string $format): array
    {
        return [
            PromoCode::class => true,
        ];
    }
}