<?php

namespace App\Serializer\Normalizer;

use App\Entity\Category;
use Symfony\Component\Serializer\Normalizer\NormalizerInterface;

class CategoryNormalizer implements NormalizerInterface
{
    public function supportsNormalization($data, ?string $format = null, array $context = []): bool
    {
        return $data instanceof Category;
    }

    public function normalize($object, ?string $format = null, array $context = []): array
    {
        return [
            'id' => $object->getId(),
            'name' => $object->getName(),
            'icon' => $object->getIcon(),
        ];
    }

    public function getSupportedTypes(?string $format): array
    {
        return [
            Category::class => true,
        ];
    }
}
