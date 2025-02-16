<?php

declare(strict_types=1);

namespace App\Controller;

use App\Services\ReviewService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class ReviewController extends AbstractController
{
    public function __construct(private readonly ReviewService $reviewService)
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
}
