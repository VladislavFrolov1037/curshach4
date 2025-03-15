<?php

namespace App\Serializer\Normalizer;

use App\Entity\Product;
use App\Repository\FeedbackRepository;
use App\Repository\OrderRepository;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\Serializer\Normalizer\NormalizerAwareInterface;
use Symfony\Component\Serializer\Normalizer\NormalizerAwareTrait;
use Symfony\Component\Serializer\Normalizer\NormalizerInterface;

class ProductNormalizer implements NormalizerInterface, NormalizerAwareInterface
{
    use NormalizerAwareTrait;

    public function __construct(private readonly OrderRepository $orderRepository, private readonly Security $security, private readonly FeedbackRepository $feedbackRepository)
    {
    }

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
                'viewsCount' => $object->getViewsCount(),
                'rating' => $this->feedbackRepository->getProductRating($object),
                'images' => array_map(
                    fn ($image) => $this->normalizer->normalize($image, $format, $context),
                    $object->getImages()->toArray()
                ),
                'seller' => [
                    'id' => $object->getSeller()->getId(),
                    'name' => $object->getSeller()->getName(),
                    'userId' => $object->getSeller()->getUser()->getId(),
                    'image' => $object->getSeller()->getImage(),
                ],
                'category' => [
                    'id' => $object->getCategory()->getId(),
                    'name' => $object->getCategory()->getName(),
                ],
                'feedbacks' => array_map(
                    fn ($feedback) => $this->normalizer->normalize($feedback, $format, ['shortly' => true]),
                    $this->feedbackRepository->getFeedbacksForProduct($object, $this->security->getUser())
                ),
                'product_attributes' => array_map(
                    fn ($attribute) => [
                        'name' => $attribute->getAttributeKey(),
                        'value' => $attribute->getValue(),
                    ],
                    $object->getAttributes()->toArray()
                ),
            ];
        }

        return [
            'id' => $object->getId(),
            'name' => $object->getName(),
            'price' => $object->getPrice(),
            'quantity' => $object->getQuantity(),
            'status' => $object->getStatus(),
            'viewsCount' => $object->getViewsCount(),
            'isReceivedProduct' => $this->security->getUser() ? $this->orderRepository->hasUserReceivedProduct($this->security->getUser(), $object) : '',
            'isProductReview' => $this->security->getUser() ? $this->feedbackRepository->hasProductReviewFromUser($this->security->getUser(), $object) : '',
            'images' => array_map(
                fn ($image) => $this->normalizer->normalize($image, $format, $context),
                $object->getImages()->toArray()
            ),
            'rating' => $this->feedbackRepository->getProductRating($object),
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
