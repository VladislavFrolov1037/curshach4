<?php

namespace App\Serializer\Normalizer;

use App\Entity\Favorite;
use Symfony\Component\Serializer\Normalizer\NormalizerAwareInterface;
use Symfony\Component\Serializer\Normalizer\NormalizerAwareTrait;
use Symfony\Component\Serializer\Normalizer\NormalizerInterface;

class FavoriteNormalizer implements NormalizerInterface, NormalizerAwareInterface
{
    use NormalizerAwareTrait;

    public function normalize(mixed $object, ?string $format = null, array $context = []): array|string|int|float|bool|\ArrayObject|null
    {
        if ($context['detailed'] ?? false) {
            return [
                'id' => $object->getId(),
                'product_id' => $object->getProduct()->getId(),
                'user_id' => $object->getUser()->getId(),
                'created_at' => $object->getCreatedAt(),
                'product' => $this->normalizer->normalize($object->getProduct(), $format, ['detailed' => false]),
            ];
        }

        return [
            'id' => $object->getId(),
            'product_id' => $object->getProduct()->getId(),
            'user_id' => $object->getUser()->getId(),
            'created_at' => $object->getCreatedAt(),
        ];
    }

    public function supportsNormalization(mixed $data, ?string $format = null, array $context = []): bool
    {
        return $data instanceof Favorite;
    }

    public function getSupportedTypes(?string $format): array
    {
        return [
            Favorite::class => true,
        ];
    }
}
