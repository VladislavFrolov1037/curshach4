<?php

declare(strict_types=1);

namespace App\Controller;

use App\Entity\Order;
use App\Entity\OrderItem;
use App\Enum\OrderStatus;
use App\Repository\OrderRepository;
use App\Repository\ProductRepository;
use App\Services\OrderService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Contracts\Translation\TranslatorInterface;

class OrderController extends AbstractController
{
    public function __construct(private readonly TranslatorInterface $translator, private readonly OrderService $orderService, private readonly OrderRepository $orderRepository, private readonly ProductRepository $productRepository, private EntityManagerInterface $em)
    {
    }

    #[Route('/api/order', name: 'create_order', methods: ['POST'])]
    public function createOrder(Request $request, MailerInterface $mailer): JsonResponse
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
        $order->setStatus(OrderStatus::STATUS_NEW);
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

        $user = $this->getUser();

        $email = (new Email())
            ->from('vladoperation@bk.ru')
            ->to($user->getEmail())
            ->subject('Оформление заказа')
            ->text($user->getName().', ваш заказ успешно оформлен! Общая сумма заказа: '.$order->getTotalPrice()."р.\n".'Не забудьте оплатить заказ в личном кабинете.');

        $mailer->send($email);

        return $this->json(['message' => 'Заказ создан', 'orderId' => $order->getId()], Response::HTTP_CREATED);
    }

    #[Route('/api/order/{id}/pay', name: 'pay_order', methods: ['POST'])]
    public function payOrder(Order $order): JsonResponse
    {
        if (OrderStatus::STATUS_NEW !== $order->getStatus()) {
            return $this->json(['error' => 'Оплатить можно только новый заказ'], Response::HTTP_BAD_REQUEST);
        }

        // Здесь вомзонжо будет логика интеграции с платежной системой

        $order->setStatus(OrderStatus::STATUS_PAID);
        $this->em->flush();

        return $this->json(['message' => 'Заказ оплачен', 'orderId' => $order->getId()]);
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
                'status' => $this->translator->trans($order->getStatus()),
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

    #[Route('/api/order/{id}/cancel', name: 'cancel_order', methods: ['POST'])]
    public function cancelOrder(int $id): JsonResponse
    {
        $user = $this->getUser();

        $order = $this->orderRepository->find($id);

        if (!$order || $order->getUser() !== $user) {
            return $this->json(['error' => 'Заказ не найден или доступ запрещен'], Response::HTTP_FORBIDDEN);
        }

        if (OrderStatus::STATUS_NEW !== $order->getStatus()) {
            return $this->json(['error' => 'Отменить можно только заказы со статусом "new"'], Response::HTTP_BAD_REQUEST);
        }

        $now = new \DateTimeImmutable();
        $timeDiff = $now->getTimestamp() - $order->getCreatedAt()->getTimestamp();

        if ($timeDiff > 600) {
            return $this->json(['error' => 'Срок отмены заказа истёк'], Response::HTTP_BAD_REQUEST);
        }

        $order->setStatus('cancelled');
        $this->em->flush();

        return $this->json(['message' => 'Заказ успешно отменён'], Response::HTTP_OK);
    }
}
