<?php

namespace App\Serializer\Normalizer;

use App\Entity\Seller;
use App\Enum\ProductStatus;
use App\Repository\ProductRepository;
use Symfony\Component\Serializer\Normalizer\NormalizerAwareInterface;
use Symfony\Component\Serializer\Normalizer\NormalizerAwareTrait;
use Symfony\Component\Serializer\Normalizer\NormalizerInterface;

class SellerNormalizer implements NormalizerInterface, NormalizerAwareInterface
{
    use NormalizerAwareTrait;

    public function __construct(private readonly ProductRepository $productRepository)
    {
    }

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
            'cardNumber' => $object->getCardNumber(),
            'rating' => $this->productRepository->getSellerRating($object),
            'salesCount' => $this->productRepository->getSalesCount($object),
            'yearsOnPlatform' => $object->getYearsOnPlatform(),
            'user' => $object->getUser()->getId(),
            'products' => $this->normalizer->normalize($this->productRepository->findBy(['seller' => $object, 'status' => ProductStatus::STATUS_AVAILABLE])),
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
