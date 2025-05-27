<?php

namespace App\Serializer\Normalizer;

use App\Entity\Seller;
use App\Enum\ProductStatus;
use App\Repository\ProductRepository;
use App\Repository\SellerRepository;
use Symfony\Component\Serializer\Normalizer\NormalizerAwareInterface;
use Symfony\Component\Serializer\Normalizer\NormalizerAwareTrait;
use Symfony\Component\Serializer\Normalizer\NormalizerInterface;
use Symfony\Contracts\Translation\TranslatorInterface;

class SellerNormalizer implements NormalizerInterface, NormalizerAwareInterface
{
    use NormalizerAwareTrait;

    public function __construct(private readonly ProductRepository $productRepository, private readonly TranslatorInterface $translator)
    {
    }

    public function normalize(mixed $object, ?string $format = null, array $context = []): array|string|int|float|bool|\ArrayObject|null
    {
        return [
            'id' => $object->getId(),
            'createdAt' => $object->getCreatedAt()->format('d.m.Y'),
            'name' => $object->getName(),
            'description' => $object->getDescription(),
            'status' => $this->translator->trans($object->getStatus()->value),
            'type' => $this->translator->trans($object->getType()),
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
