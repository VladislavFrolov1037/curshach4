<?php

namespace App\Serializer\Normalizer;

use App\Entity\FeedbackReply;
use App\Repository\FeedbackReactionRepository;
use App\Repository\FeedbackRepository;
use App\Repository\OrderRepository;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\Serializer\Normalizer\NormalizerAwareInterface;
use Symfony\Component\Serializer\Normalizer\NormalizerAwareTrait;
use Symfony\Component\Serializer\Normalizer\NormalizerInterface;

class FeedbackReplyNormalizer implements NormalizerInterface, NormalizerAwareInterface
{
    use NormalizerAwareTrait;

    public function __construct(private readonly OrderRepository $orderRepository, private readonly Security $security, private readonly FeedbackRepository $feedbackRepository, private readonly FeedbackReactionRepository $feedbackReactionRepository)
    {
    }

    public function normalize(mixed $object, ?string $format = null, array $context = []): array|string|int|float|bool|\ArrayObject|null
    {
        return [
            'id' => $object->getId(),
            'comment' => $object->getComment(),
            'createdAt' => $object->getCreatedAt()->format('c'),
            'user' => $this->normalizer->normalize($object->getUser(), null, ['shortly' => true]),
        ];
    }

    public function supportsNormalization(mixed $data, ?string $format = null, array $context = []): bool
    {
        return $data instanceof FeedbackReply;
    }

    public function getSupportedTypes(?string $format): array
    {
        return [
            FeedbackReply::class => true,
        ];
    }
}
