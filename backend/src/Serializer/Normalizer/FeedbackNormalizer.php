<?php

namespace App\Serializer\Normalizer;

use App\Entity\Feedback;
use App\Repository\FeedbackReactionRepository;
use App\Repository\FeedbackRepository;
use App\Repository\OrderRepository;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\Serializer\Normalizer\NormalizerAwareInterface;
use Symfony\Component\Serializer\Normalizer\NormalizerAwareTrait;
use Symfony\Component\Serializer\Normalizer\NormalizerInterface;

class FeedbackNormalizer implements NormalizerInterface, NormalizerAwareInterface
{
    use NormalizerAwareTrait;

    public function __construct(private readonly OrderRepository $orderRepository, private readonly Security $security, private readonly FeedbackRepository $feedbackRepository, private readonly FeedbackReactionRepository $feedbackReactionRepository)
    {
    }

    public function normalize(mixed $object, ?string $format = null, array $context = []): array|string|int|float|bool|\ArrayObject|null
    {
        if ($context['shortly'] ?? false) {
            return [
                'id' => $object->getId(),
                'rating' => $object->getRating(),
                'comment' => $object->getComment(),
                'image' => $object->getImage(),
                'status' => $object->getStatus(),
                'createdAt' => $object->getCreatedAt(),
                'user' => $this->normalizer->normalize($object->getUser(), null, ['shortly' => true]),
                'likes' => $object->getLikes(),
                'dislikes' => $object->getDislikes(),
                'userReaction' => $this->feedbackReactionRepository->findOneBy(['feedback' => $object, 'user' => $this->security->getUser()])?->getReactionType(),
                'replies' => $this->normalizer->normalize($object->getFeedbackReplies()),
            ];
        }

        return [
            'id' => $object->getId(),
            'rating' => $object->getRating(),
            'comment' => $object->getComment(),
            'image' => $object->getImage(),
            'status' => $object->getStatus(),
            'createdAt' => $object->getCreatedAt(),
            'user' => $this->normalizer->normalize($object->getUser(), null, ['shortly' => true]),
            'likes' => $object->getLikes(),
            'dislikes' => $object->getDislikes(),
            'userReaction' => $this->feedbackReactionRepository->findOneBy(['feedback' => $object, 'user' => $this->security->getUser()])?->getReactionType(),
            'replies' => $this->normalizer->normalize($object->getFeedbackReplies()),
            'product' => $this->normalizer->normalize($object->getProduct()),
        ];
    }

    public function supportsNormalization(mixed $data, ?string $format = null, array $context = []): bool
    {
        return $data instanceof Feedback;
    }

    public function getSupportedTypes(?string $format): array
    {
        return [
            Feedback::class => true,
        ];
    }
}
