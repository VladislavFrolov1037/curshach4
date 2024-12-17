<?php

declare(strict_types=1);

namespace App\Controller;

use App\Entity\Order;
use App\Entity\OrderItem;
use App\Repository\OrderRepository;
use App\Repository\ProductRepository;
use App\Services\OrderService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class OrderController extends AbstractController
{
    public function __construct(private readonly OrderService $orderService, private readonly OrderRepository $orderRepository, private readonly ProductRepository $productRepository, private EntityManagerInterface $em)
    {
    }

    #[Route('/api/order', name: 'create_order', methods: ['POST'])]
    public function createOrder(Request $request): JsonResponse
    {
        $user = $this->getUser();
        $data = json_decode($request->getContent(), true);

        $shippingAddress = $data['shippingAddress'] ?? '';

        $cart = $user->getCart();
        $cartItems = $cart->getCartItems();

        if ($cartItems->isEmpty()) {
            return $this->json(['error' => 'Корзина пуста'], Response::HTTP_BAD_REQUEST);
        }

        $order = new Order();
        $order->setUser($user);
        $order->setShippingAddress($shippingAddress);
        $order->setCreatedAt(new \DateTimeImmutable());
        $order->setStatus('created');
        $totalPrice = 0;

        foreach ($cartItems as $item) {
            $product = $item->getProduct();

            if (!$product || $product->getQuantity() < $item->getQuantity()) {
                return $this->json(['error' => 'Недостаточно товара'], Response::HTTP_BAD_REQUEST);
            }

            $product->setQuantity($product->getQuantity() - $item->getQuantity());

            $orderItem = new OrderItem();
            $orderItem->setProduct($product);
            $orderItem->setQuantity($item->getQuantity());
            $orderItem->setPrice((int) $product->getPrice() * $item->getQuantity());
            $orderItem->setRequest($order);
            $this->em->persist($orderItem);

            $totalPrice += $orderItem->getPrice();
        }

        $order->setTotalPrice($totalPrice);
        $this->em->persist($order);

        foreach ($cartItems as $cartItem) {
            $this->em->remove($cartItem);
        }
        $this->em->flush();


        return $this->json(['message' => 'Заказ создан', 'orderId' => $order->getId()], Response::HTTP_CREATED);
    }

    #[Route('/api/orders', name: 'get_user_orders', methods: ['GET'])]
    public function getUserOrders(): JsonResponse
    {
        $user = $this->getUser();

        if (!$user) {
            return new JsonResponse(['error' => 'Пользователь не авторизован'], 401);
        }

        $orders = $this->orderRepository->findBy(['user' => $user]);

        $ordersData = [];
        foreach ($orders as $order) {
            $ordersData[] = [
                'id' => $order->getId(),
                'createdAt' => $order->getCreatedAt()->format('Y-m-d H:i:s'),
                'status' => $order->getStatus(),
                'totalPrice' => $order->getTotalPrice(),
                'orderItems' => array_map(function ($orderItem) {
                    return [
                        'productId' => $orderItem->getProduct()->getId(),
                        'productName' => $orderItem->getProduct()->getName(),
                        'quantity' => $orderItem->getQuantity(),
                        'price' => $orderItem->getPrice(),
                    ];
                }, $order->getOrderItems()->toArray()),
            ];
        }

        return new JsonResponse($ordersData);
    }

    // src/Controller/OrderController.php

//    #[Route('/api/orders/{id}', name: 'get_order_details', methods: ['GET'])]
//    public function getOrderDetails(int $id): JsonResponse
//    {
//        $user = $this->security->getUser();
//
//        if (!$user) {
//            return new JsonResponse(['error' => 'Пользователь не авторизован'], 401);
//        }
//
//        $order = $this->orderRepository->findOneBy(['user' => $user, 'id' => $id]);
//
//        if (!$order) {
//            return new JsonResponse(['error' => 'Заказ не найден'], 404);
//        }
//
//        return new JsonResponse($orderData);
//    }


    #[Route('/api/order/{id}/cancel', name: 'cancel_order', methods: ['POST'])]
    public function cancelOrder(int $id): JsonResponse
    {
        $user = $this->getUser();

        $order = $this->orderRepository->find($id);

        if (!$order || $order->getUser() !== $user) {
            return $this->json(['error' => 'Заказ не найден или доступ запрещен'], Response::HTTP_FORBIDDEN);
        }

        if ('created' !== $order->getStatus()) {
            return $this->json(['error' => 'Отменить можно только заказы со статусом "created"'], Response::HTTP_BAD_REQUEST);
        }

        $now = new \DateTimeImmutable();
        $timeDiff = $now->getTimestamp() - $order->getCreatedAt()->getTimestamp();

        if ($timeDiff > 600) { // 10 минут = 600 секунд
            return $this->json(['error' => 'Срок отмены заказа истёк'], Response::HTTP_BAD_REQUEST);
        }

        $order->setStatus('cancelled');
        $this->em->flush();

        return $this->json(['message' => 'Заказ успешно отменён'], Response::HTTP_OK);
    }
}
