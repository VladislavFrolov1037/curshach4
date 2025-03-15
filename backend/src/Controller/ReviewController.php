<?php

declare(strict_types=1);

namespace App\Controller;

use App\Entity\Feedback;
use App\Entity\FeedbackReport;
use App\Services\ReviewService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class ReviewController extends AbstractController
{
    public function __construct(private readonly ReviewService $reviewService, private readonly EntityManagerInterface $entityManager)
    {
    }

    #[Route('/api/review', name: 'create-review', methods: ['POST'])]
    public function createReview(Request $request): Response
    {
        $data = array_merge($request->request->all(), [
            'image' => $request->files->get('image'),
        ]);

        $review = $this->reviewService->createReview($data);

        return $this->json(['success' => $review]);
    }

    #[Route('/api/review/{id}', name: 'add-reaction', methods: ['POST'])]
    public function addReaction(Request $request, Feedback $feedback): Response
    {
        $this->reviewService->addReaction($feedback, json_decode($request->getContent(), true)['type']);

        return $this->json(['success' => true]);
    }

    #[Route('/api/review/{id}/reply', name: 'reply-review', methods: ['POST'])]
    public function replyToReview(Feedback $feedback, Request $request): JsonResponse
    {
        $feedbackReply = $this->reviewService->replyToReview($feedback, json_decode($request->getContent(), true)['comment']);

        return $this->json(['feedbackReply' => $feedbackReply]);
    }

    #[Route('/api/review/{id}', name: 'delete-review', methods: ['DELETE'])]
    public function deleteReview(Feedback $feedback): JsonResponse
    {
        $this->reviewService->deleteReview($feedback);

        return $this->json([], 204);
    }

    public function reportReview(Feedback $feedback, Request $request): JsonResponse
    {
        $reason = $request->request->get('reason');

        $feedbackReport = (new FeedbackReport())
            ->setFeedback($feedback)
            ->setReason($reason)
            ->setUser($this->getUser())
            ->setStatus('pending')
            ->setCreatedAt(new \DateTimeImmutable());

        $this->entityManager->persist($feedbackReport);
        $this->entityManager->flush();

        return $this->json($feedbackReport);
    }
}
