<?php

declare(strict_types=1);

namespace App\Controller;

use App\Entity\Order;
use App\Entity\OrderItem;
use App\Enum\OrderStatus;
use App\Repository\CartItemRepository;
use App\Repository\OrderRepository;
use App\Repository\ProductRepository;
use App\Repository\PromoCodeRepository;
use App\Services\OrderService;
use App\Services\PaymentService;
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
    public function __construct(private readonly TranslatorInterface $translator, private readonly OrderService $orderService, private readonly OrderRepository $orderRepository, private readonly ProductRepository $productRepository, private EntityManagerInterface $em, private readonly PaymentService $paymentService, private readonly CartItemRepository $cartItemRepository, private readonly PromoCodeRepository $promoCodeRepository)
    {
    }

    #[Route('/api/order', name: 'create_order', methods: ['POST'])]
    public function createOrder(Request $request, MailerInterface $mailer): JsonResponse
    {
        $user = $this->getUser();
        $data = json_decode($request->getContent(), true);

        $shippingAddress = $data['shippingAddress'] ?? '';

        $cart = $user->getCart();
        $cartItems = $this->cartItemRepository->getCartItemsWithAvailableProducts($cart);

        if (empty($cartItems)) {
            return $this->json(['error' => 'Корзина пуста'], Response::HTTP_BAD_REQUEST);
        }

        $promoCode = !empty($data['promoCode']) ? $this->promoCodeRepository->findOneBy(['code' => $data['promoCode']]) : null;
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

        if ($promoCode) {
            $order->setPromoCode($promoCode);
            $promoCode?->setUsedCount($promoCode->getUsedCount() + 1);
            $totalPrice = $totalPrice - ($totalPrice * ($promoCode->getDiscount() / 100));
            $this->em->persist($promoCode);
        }

        $order->setTotalPrice($totalPrice);
        $this->em->persist($order);

        foreach ($cartItems as $cartItem) {
            $this->em->remove($cartItem);
        }

        $this->em->flush();

        try {
            $user = $this->getUser();

            $email = (new Email())
                ->from('vladoperation@bk.ru')
                ->to($user->getEmail())
                ->subject('Оформление заказа')
                ->text($user->getName().', ваш заказ успешно оформлен! Общая сумма заказа: '.$order->getTotalPrice()."р.\n".'Не забудьте оплатить заказ.');

            $mailer->send($email);
        } catch (\Exception $e) {
            throw $e;
        }

        return $this->getPayOrderData($order);
    }

    #[Route('/api/validatePromoCode/{promoCode}', name: 'validate_promo', methods: ['GET'])]
    public function validatePromo(Request $request): JsonResponse
    {
        $promoCode = $this->promoCodeRepository->findOneBy(['code' => $request->get('promoCode')]);

        if ($promoCode) {
            return $this->json($promoCode);
        }

        return $this->json(['error' => $this->translator->trans('This promo code is unavailable')]);
    }

    #[Route('/api/payment-data/{order}', name: 'get_payment_data', methods: ['GET'])]
    public function getPayOrderData(Order $order): JsonResponse
    {
        return $this->json([
            'orderId' => $order->getId(),
            'receiver' => '4100118924862929',
            'sum' => $order->getTotalPrice(),
            'url' => 'https://yoomoney.ru/quickpay/confirm',
        ]);
    }

    #[Route('/api/fake-pay/order/{id}', name: 'pay_fake_order', methods: ['POST'])]
    public function fakePayOrder(Order $order): JsonResponse
    {
        $order->setStatus(OrderStatus::STATUS_PAID);
        $this->paymentService->distributePaymentAmongSellers($order);

        $this->em->persist($order);
        $this->em->flush();

        return $this->json(['success' => true]);
    }

    #[Route('/api/orders', name: 'get_user_orders', methods: ['GET'])]
    public function getUserOrders(Request $request): JsonResponse
    {
        $status = null !== $request->query->get('status') ? $request->query->get('status') : 'active';

        $user = $this->getUser();

        $orders = $this->orderRepository->findUserOrders($user, $status);

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
                        'img' => $orderItem->getProduct()->getImages()->first()->getUrl(),
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
