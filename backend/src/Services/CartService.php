<?php

namespace App\Services;

use App\Entity\Cart;
use App\Entity\CartItem;
use App\Entity\Product;
use App\Repository\CartItemRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\JsonResponse;

class CartService
{
    public function __construct(private readonly Security $security, private readonly CartItemRepository $cartItemRepository, private readonly EntityManagerInterface $em)
    {
    }

    public function addToCart(Product $product)
    {
        $cart = $this->security->getUser()->getCart();

        $cartItem = $this->cartItemRepository->findCartItemByUserAndProduct($product, $cart);

        if ($cartItem) {
            $cartItem->setQuantity($cartItem->getQuantity() + 1);
            $cartItem->setPrice($cartItem->getPrice() + $product->getPrice());
        } else {
            $cartItem = new CartItem();
            $cartItem->setQuantity(1);
            $cartItem->setPrice($product->getPrice());
            $cartItem->setProduct($product);
            $cartItem->setCart($cart);

            $this->em->persist($cartItem);
        }

        $this->em->flush();

        $cart->recalculateTotalPrice();

        $this->em->flush();

        return $cartItem;
    }

    public function deleteProduct(Product $product): JsonResponse
    {
        $cart = $this->security->getUser()->getCart();
        $cartItem = $this->cartItemRepository->findCartItemByUserAndProduct($product, $cart);

        $this->em->remove($cartItem);
        $this->em->flush();

        $cart->recalculateTotalPrice();

        $this->em->flush();

        return new JsonResponse([], 204);
    }

    public function changeQuantity(Product $product, int $quantity): Cart
    {
        $cart = $this->security->getUser()->getCart();
        $cartItem = $this->cartItemRepository->findCartItemByUserAndProduct($product, $cart);

        $newQuantity = $cartItem->getQuantity() + $quantity;

        if ($newQuantity <= 0) {
            $this->em->remove($cartItem);
            $this->em->flush();
        } else {
            $cartItem->setQuantity($newQuantity);
            $cartItem->setPrice($newQuantity * $product->getPrice());
        }

        $cart->recalculateTotalPrice();
        $this->em->flush();

        return $cart;
    }
}
