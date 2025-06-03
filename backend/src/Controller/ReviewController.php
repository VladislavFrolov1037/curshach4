<?php

declare(strict_types=1);

namespace App\Controller;

use App\Entity\Feedback;
use App\Entity\FeedbackReport;
use App\Repository\FeedbackRepository;
use App\Services\ReviewService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class ReviewController extends AbstractController
{
    public function __construct(private readonly ReviewService $reviewService, private readonly EntityManagerInterface $entityManager, private readonly FeedbackRepository $feedbackRepository)
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

    #[Route('/api/review/{id}/report', name: 'report-review', methods: ['POST'])]
    public function reportReview(Feedback $feedback, Request $request): JsonResponse
    {
        $reason = json_decode($request->getContent(), true)['reason'];

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

    #[Route('/api/review-reports', name: 'reports-review', methods: ['GET'])]
    public function getReportsReview(): JsonResponse
    {
        $reviews = $this->feedbackRepository->getReviewWithReport();

        $data = [];

        foreach ($reviews as $review) {
            foreach ($review->getFeedbackReports() as $report) {
                $data[] = [
                    'id' => $report->getId(),
                    'reason' => $report->getReason(),
                    'createdAt' => $report->getCreatedAt()->format('Y-m-d H:i:s'),
                    'status' => $report->getStatus(),
                    'review' => $review,
                    'userId' => $report->getUser()->getId(),
                ];
            }
        }

        return $this->json($data);
    }

    #[Route('/api/review-reports/{id}/approve', name: 'report_approve', methods: ['PATCH'])]
    public function approveReport(FeedbackReport $report): JsonResponse
    {
        if ($report->getStatus() !== 'pending') {
            return $this->json(['error' => 'Статус уже изменен'], 400);
        }

        $report->setStatus('approved');
        $this->entityManager->flush();

        return $this->json(['message' => 'Жалоба одобрена']);
    }

    #[Route('/api/review-reports/{id}/reject', name: 'report_reject', methods: ['PATCH'])]
    public function rejectReport(FeedbackReport $report): JsonResponse
    {
        if ($report->getStatus() !== 'pending') {
            return $this->json(['error' => 'Статус уже изменен'], 400);
        }

        $report->setStatus('rejected');
        $this->entityManager->flush();

        return $this->json(['message' => 'Жалоба отклонена']);
    }
}
