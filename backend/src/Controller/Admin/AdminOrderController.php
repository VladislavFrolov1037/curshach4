<?php

declare(strict_types=1);

namespace App\Controller\Admin;

use App\Entity\Order;
use App\Enum\OrderStatus;
use App\Repository\OrderRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class AdminOrderController extends AbstractController
{
    public function __construct(private readonly OrderRepository $orderRepository, private readonly EntityManagerInterface $em)
    {
    }

    #[Route('/api/admin/order', name: 'admin_order', methods: ['GET'])]
    public function index(): Response
    {
        $orders = $this->orderRepository->findAll();

        return $this->json($orders, 200, [], ['detailed' => true]);
    }

    #[Route('/api/admin/order/{id}/status', name: 'update_order_status', methods: ['POST'])]
    public function updateOrderStatus(Request $request, Order $order):  JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $newStatus = $data['status'];

        $validTransitions = [
            OrderStatus::STATUS_PAID => [OrderStatus::STATUS_PROCESSING],
            OrderStatus::STATUS_PROCESSING => [OrderStatus::STATUS_SHIPPED],
            OrderStatus::STATUS_SHIPPED => [OrderStatus::STATUS_DELIVERED],
            OrderStatus::STATUS_NEW => [OrderStatus::STATUS_CANCELLED],
        ];

        $currentStatus = $order->getStatus();

        if (!in_array($newStatus, $validTransitions[$currentStatus] ?? [])) {
            return $this->json(['error' => 'Невозможный переход статуса'], Response::HTTP_BAD_REQUEST);
        }

        $order->setStatus($newStatus);
        $this->em->flush();

        return $this->json(['message' => 'Статус заказа обновлен', 'orderId' => $order->getId()]);
    }
}
