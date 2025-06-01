<?php

namespace App\Services;

use App\Entity\Feedback;
use App\Entity\FeedbackReaction;
use App\Entity\FeedbackReply;
use App\Enum\ReactionType;
use App\Repository\FeedbackReactionRepository;
use App\Repository\OrderRepository;
use App\Repository\ProductRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\SecurityBundle\Security;

class ReviewService
{
    public function __construct(private EntityManagerInterface $em, private Security $security, private readonly ProductRepository $productRepository, private readonly OrderRepository $orderRepository, private readonly FeedbackReactionRepository $feedbackReactionRepository, private readonly FileService $fileService)
    {
    }

    public function createReview(array $data): Feedback
    {
        $user = $this->security->getUser();
        $product = $this->productRepository->find($data['productId']);

        $review = (new Feedback())
            ->setUser($user)
            ->setProduct($product)
            ->setRating($data['rating'])
            ->setComment('' !== $data['comment'] ? $data['comment'] : null)
            ->setCreatedAt(new \DateTimeImmutable())
            ->setStatus('active')
            ->setImage($data['image'] ?? null);

        $this->em->persist($review);
        $this->em->flush();

        return $review;
    }

    public function addReaction(Feedback $feedback, string $type)
    {
        $user = $this->security->getUser();

        $reactionType = ReactionType::tryFrom($type);

        if (!$reactionType) {
            throw new \Exception('Не найден тип реакции:" '.$type);
        }

        $existingReaction = $this->feedbackReactionRepository->findOneBy(['user' => $user, 'feedback' => $feedback]);

        if ($existingReaction) {
            if ($existingReaction->getReactionType() === $reactionType) {
                $this->em->remove($existingReaction);
                $this->em->flush();

                return null;
            }

            $existingReaction->setReactionType($reactionType);
        } else {
            $reaction = new FeedbackReaction();
            $reaction->setUser($user);
            $reaction->setFeedback($feedback);
            $reaction->setReactionType($reactionType);
            $this->em->persist($reaction);
        }

        $this->em->flush();

        return $existingReaction ?? $reaction;
    }

    public function replyToReview(Feedback $feedback, string $comment): FeedbackReply
    {
        $feedbackReply = (new FeedbackReply())
            ->setUser($this->security->getUser())
            ->setFeedback($feedback)
            ->setComment($comment)
            ->setCreatedAt(new \DateTimeImmutable());

        $this->em->persist($feedbackReply);
        $this->em->flush();

        return $feedbackReply;
    }

    public function deleteReview(Feedback $feedback): void
    {
        $feedback->setStatus('deleted');
        $this->em->flush();
    }
}
