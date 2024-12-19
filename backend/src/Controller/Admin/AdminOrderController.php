<?php

declare(strict_types=1);

namespace App\Controller\Admin;

use App\Repository\OrderRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class AdminOrderController extends AbstractController
{
    public function __construct(private readonly OrderRepository $orderRepository)
    {
    }

    #[Route('/api/admin/order', name: 'admin_order', methods: ['GET'])]
    public function index(): Response
    {
        $orders = $this->orderRepository->findAll();

        return $this->json($orders);
    }
}
