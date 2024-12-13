<?php

declare(strict_types=1);

namespace App\Controller;

use App\Entity\Cart;
use App\Entity\Product;
use App\Repository\CartRepository;
use App\Services\CartService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class CartController extends AbstractController
{
    public function __construct(private readonly CartRepository $cartRepository, private readonly CartService $cartService)
    {
    }

    #[Route('/api/cart')]
    public function index(): Response
    {
        return $this->json($this->getUser()->getCart());
    }

    #[Route('/api/product/{id}/cart', name: 'add_cart', methods: ['POST'])]
    public function store(Product $product): Response
    {
        $cartItem = $this->cartService->addToCart($product);

        return $this->json($cartItem);
    }

    #[Route('/api/product/{id}/cart', name: 'delete_cart_product', methods: ['DELETE'])]
    public function delete(Product $product): Response
    {
        return $this->cartService->deleteProduct($product);
    }

    #[Route('/api/product/{id}/cart/increase', name: 'increase_cart_product', methods: ['PATCH'])]
    public function increase(Product $product): Response
    {
        $cart = $this->cartService->changeQuantity($product, 1);

        return $this->json($cart);
    }

    #[Route('/api/product/{id}/cart/decrease', name: 'decrease_cart_product', methods: ['PATCH'])]
    public function decrease(Product $product): Response
    {
        $cart = $this->cartService->changeQuantity($product, -1);

        return $this->json($cart);
    }
}
