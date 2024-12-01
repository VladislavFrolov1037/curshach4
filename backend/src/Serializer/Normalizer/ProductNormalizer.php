<?php

namespace App\Serializer\Normalizer;

use App\Entity\Product;
use Symfony\Component\Serializer\Normalizer\NormalizerInterface;

class ProductNormalizer implements NormalizerInterface
{
    public function normalize(mixed $object, ?string $format = null, array $context = []): array|string|int|float|bool|\ArrayObject|null
    {
        if ($context['detailed'] ?? false) {
            return [
                'id' => $object->getId(),
                'name' => $object->getName(),
                'description' => $object->getDescription(),
                'price' => $object->getPrice(),
                'quantity' => $object->getQuantity(),
                'status' => $object->getStatus(),
                'image' => $object->getImage(),
                'seller' => [
                    'id' => $object->getSeller()->getId(),
                    'name' => $object->getSeller()->getName(),
                    'userId' => $object->getSeller()->getUser()->getId(),
                ],
                'category' => [
                    'id' => $object->getCategory()->getId(),
                    'name' => $object->getCategory()->getName(),
                ],
//                'rating' => $object->getRating(),
//                'comment' => $object->getComment(),
                'product_attributes' => array_map(
                    fn($attribute) => [
                        'name' => $attribute->getAttributeKey(),
                        'value' => $attribute->getValue(),
                    ],
                    $object->getAttributes()->toArray()
                )
            ];
        }

        return [
            'id' => $object->getId(),
            'name' => $object->getName(),
            'price' => $object->getPrice(),
            'quantity' => $object->getQuantity(),
            'status' => $object->getStatus(),
            'image' => $object->getImage(),
            'seller' => [
                'id' => $object->getSeller()->getId(),
                'name' => $object->getSeller()->getName(),
                'userId' => $object->getSeller()->getUser()->getId(),
            ],
        ];
    }

    public function supportsNormalization(mixed $data, ?string $format = null, array $context = []): bool
    {
        return $data instanceof Product;
    }

    public function getSupportedTypes(?string $format): array
    {
        return [
            Product::class => true,
        ];
    }
}
