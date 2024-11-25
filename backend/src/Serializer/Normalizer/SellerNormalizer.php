<?php

namespace App\Serializer\Normalizer;

use App\Entity\Seller;
use Symfony\Component\Serializer\Normalizer\NormalizerInterface;

class SellerNormalizer implements NormalizerInterface
{
    public function normalize(mixed $object, ?string $format = null, array $context = []): array|string|int|float|bool|\ArrayObject|null
    {
        return [
            'id' => $object->getId(),
            'name' => $object->getName(),
            'description' => $object->getDescription(),
            'status' => $object->getStatus(),
            'type' => $object->getType(),
            'taxId' => $object->getTaxId(),
            'passport' => $object->getPassport(),
            'phone' => $object->getPhone(),
            'email' => $object->getEmail(),
            'address' => $object->getAddress(),
            'image' => $object->getImage(),
            'balance' => $object->getBalance(),
            'user' => $object->getUser()->getId(),
        ];
    }

    public function supportsNormalization(mixed $data, ?string $format = null, array $context = []): bool
    {
        return $data instanceof Seller;
    }

    public function getSupportedTypes(?string $format): array
    {
        return [
            Seller::class => true,
        ];
    }
}
