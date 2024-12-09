<?php

namespace App\Serializer\Normalizer;

use App\Entity\Image;
use Symfony\Component\Serializer\Normalizer\NormalizerInterface;

class ImageNormalizer implements NormalizerInterface
{
    public function supportsNormalization($data, ?string $format = null, array $context = []): bool
    {
        return $data instanceof Image;
    }

    public function normalize($object, ?string $format = null, array $context = []): array
    {
        return [
            'url' => $object->getUrl(),
            'product_id' => $object->getProduct()->getId(),
            'sequence' => $object->getSequence(),
        ];
    }

    public function getSupportedTypes(?string $format): array
    {
        return [
            Image::class => true,
        ];
    }
}
