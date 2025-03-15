<?php

namespace App\Repository;

use App\Entity\Cart;
use App\Entity\CartItem;
use App\Entity\Product;
use App\Enum\ProductStatus;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<CartItem>
 */
class CartItemRepository extends ServiceEntityRepository
{
    private CartRepository $cartRepository;

    public function __construct(ManagerRegistry $registry, CartRepository $cartRepository)
    {
        parent::__construct($registry, CartItem::class);
        $this->cartRepository = $cartRepository;
    }

    public function findCartItemByUserAndProduct(Product $product, Cart $cart)
    {
        return $this->createQueryBuilder('ci')
            ->andWhere('ci.product = :product')
            ->andWhere('ci.cart = :cart')
            ->setParameter('product', $product)
            ->setParameter('cart', $cart)
            ->getQuery()
            ->getOneOrNullResult();
    }

    public function getCartItemsWithAvailableProducts(Cart $cart)
    {
        return $this->createQueryBuilder('ci')
            ->leftJoin('ci.product', 'p')
            ->andWhere('ci.cart = :cart')
            ->andWhere('p.status = :status')
            ->setParameter('cart', $cart)
            ->setParameter('status', ProductStatus::STATUS_AVAILABLE)
            ->getQuery()
            ->getResult();
    }
}
