<?php

namespace App\Services;

use App\Entity\Order;
use App\Entity\OrderItem;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\SecurityBundle\Security;

class OrderService
{
    public function __construct(private readonly Security $security, private readonly EntityManagerInterface $em)
    {
    }

    public function addOrder()
    {
        $user = $this->security->getUser();

        $cart = $user->getCart();

        $cartItems = $cart->getCartItems();

        $order = (new Order())
            ->setTotalPrice($cart->getTotalPrice())
        ->setUser($user)
        ->setShippingAddress()
        ->setCreatedAt(new \DateTimeImmutable())
        ->setStatus();

        $this->em->persist($order);

        foreach ($cartItems as $cartItem) {
            $orderItem = (new OrderItem())
                ->setQuantity($cartItem->getQuantity())
                ->setProduct($cartItem->getProduct())
                ->setPrice($cartItem->getPrice());

            $this->em->persist($orderItem);
        }

        $this->em->flush();

        return $order;
    }
}
