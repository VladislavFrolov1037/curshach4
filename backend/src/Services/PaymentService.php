<?php

namespace App\Services;

use App\Enum\OrderStatus;
use App\Repository\OrderRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;

class PaymentService
{
    public function __construct(private EntityManagerInterface $em, private OrderRepository $orderRepository)
    {
    }

    public function payOrder($data): JsonResponse
    {
        $secretKey = 'P0xZtb2exPE3OJHuEYwnf4MR';
        $hashString = sprintf(
            '%s&%s&%s&%s&%s&%s&%s&%s&%s',
            $data['notification_type'] ?? '',
            $data['operation_id'] ?? '',
            $data['amount'] ?? '',
            $data['currency'] ?? '',
            $data['datetime'] ?? '',
            $data['sender'] ?? '',
            $data['codepro'] ?? '',
            $secretKey,
            $data['label'] ?? ''
        );
        $calculatedHash = sha1($hashString);

        if ($calculatedHash !== ($data['sha1_hash'] ?? '')) {
            return new JsonResponse(['error' => 'Invalid hash'], 403);
        }

        $order = $this->orderRepository->find($data['label']);

        if ($order->getTransactionId() === $data['operation_id']) {
            return new JsonResponse(['error' => 'Duplicate payment'], 400);
        }

        $order->setStatus(OrderStatus::STATUS_PAID);
        $order->setTransactionId($data['operation_id']);
        $this->em->persist($order);
        $this->em->flush();

        return new JsonResponse(['message' => 'Payment received'], 200);
    }
}
