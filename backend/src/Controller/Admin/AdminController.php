<?php

declare(strict_types=1);

namespace App\Controller\Admin;

use App\Repository\OrderRepository;
use App\Repository\SellerRepository;
use App\Repository\UserRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

class AdminController extends AbstractController
{
    public function __construct(private readonly OrderRepository $orderRepository, private readonly UserRepository $userRepository, private readonly SellerRepository $sellerRepository)
    {
    }

    #[Route('/api/admin/dashboard', name: 'admin_dashboard_data', methods: ['GET'])]
    public function getDashboardData(): JsonResponse
    {
        $orderCount = $this->orderRepository->count([]);
        $userCount = $this->userRepository->count([]);
        $sellerCount = $this->sellerRepository->count([]);

        return $this->json([
            'orders' => $orderCount,
            'users' => $userCount,
            'sellers' => $sellerCount
        ]);
    }
}
