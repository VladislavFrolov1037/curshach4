<?php

declare(strict_types=1);

namespace App\Controller;

use App\Services\OrderService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class OrderController extends AbstractController
{
    public function __construct(private readonly OrderService $orderService)
    {
    }

    #[Route('/api/order', name: 'add_order', methods: ['POST'])]
    public function store()
    {
        $this->orderService->addOrder();

        return $this->json();
    }

}
