<?php

declare(strict_types=1);

namespace App\Controller;

use App\Entity\Product;
use App\Repository\FavoriteRepository;
use App\Services\FavoriteService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class FavoriteController extends AbstractController
{
    public function __construct(private readonly FavoriteService $favoriteService, private readonly FavoriteRepository $favoriteRepository)
    {
    }

    #[Route('/api/favorite', name: 'get_favorite', methods: ['GET'])]
    public function index(): Response
    {
        $user = $this->getUser();

        $favorite = $this->favoriteRepository->findBy(['user' => $user]);

        return $this->json($favorite, 200, [], ['detailed' => true]);
    }

    #[Route('/api/favorite/product/{id}', name: 'add_favorite', methods: ['POST'])]
    public function store(Product $product): JsonResponse
    {
        $favorite = $this->favoriteService->addFavorite($product);

        return $this->json($favorite, 201);
    }

    #[Route('/api/favorite/product/{id}', name: 'delete_favorite', methods: ['DELETE'])]
    public function delete(Product $product): JsonResponse
    {
        $this->favoriteService->deleteFavorite($product);

        return $this->json([], 204);
    }
}
