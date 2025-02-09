<?php

namespace App\Repository;

use App\Entity\Product;
use App\Enum\OrderStatus;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\Security\Core\User\UserInterface;

/**
 * @extends ServiceEntityRepository<Product>
 */
class ProductRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Product::class);
    }

    public function getProductsForFeed()
    {
        return $this->createQueryBuilder('p')
            ->andWhere('p.status = :status')
            ->setParameter('status', 'available')
            ->getQuery()
            ->getResult();
    }

    public function findPurchasedUserProducts(UserInterface $user)
    {
        return $this->createQueryBuilder('p')
            ->leftJoin('p.orderItems', 'oi')
            ->leftJoin('oi.request', 'o')
            ->andWhere('o.user = :user')
            ->andWhere('o.status = :status')
            ->setParameter('user', $user)
            ->setParameter('status', OrderStatus::STATUS_DELIVERED)
            ->groupBy('p.id')
            ->getQuery()
            ->getResult();
    }
}
