<?php

namespace App\Serializer\Normalizer;

use App\Entity\CategoryAttribute;
use Symfony\Component\Serializer\Normalizer\NormalizerInterface;

class CategoryAttributeNormalizer implements NormalizerInterface
{
    public function supportsNormalization($data, ?string $format = null, array $context = []): bool
    {
        return $data instanceof CategoryAttribute;
    }

    public function normalize($object, ?string $format = null, array $context = []): array
    {
        return [
            'id' => $object->getId(),
            'key' => $object->getAttributeKey(),
            'isRequired' => $object->isRequired(),
        ];
    }

    public function getSupportedTypes(?string $format): array
    {
        return [
            CategoryAttribute::class => true,
        ];
    }
}
