<?php

namespace App\Repository;

use App\Entity\Product;
use App\Entity\Seller;
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
            ->leftJoin('p.seller', 's')
            ->andWhere('s.status = :statusSeller')
            ->andWhere('p.status = :status')
            ->setParameter('status', 'available')
            ->setParameter('statusSeller', 'approved')
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

    public function getSellerRating(Seller $seller)
    {
        return $this->createQueryBuilder('p')
            ->leftJoin('p.feedbacks', 'f')
            ->select('AVG(f.rating) as rating, COUNT(f.id) as count')
            ->andWhere('p.seller = :seller')
            ->setParameter('seller', $seller)
            ->getQuery()
            ->getOneOrNullResult();
    }

    public function getSalesCount(Seller $seller)
    {
        return $this->createQueryBuilder('p')
            ->select('COUNT(p.id) as count')
            ->andWhere('p.seller = :seller')
            ->setParameter('seller', $seller)
            ->getQuery()
            ->getSingleScalarResult();
    }

    public function searchProducts(string $text, int $limit = 50): array
    {
        if (empty(trim($text))) {
            return [];
        }

        return $this->createQueryBuilder('p')
            ->leftJoin('p.seller', 's')
            ->leftJoin('p.category', 'c')
            ->where('(p.name LIKE :text OR p.description LIKE :text OR c.name LIKE :text)')
            ->andWhere('s.status = :statusSeller')
            ->andWhere('p.status = :statusProduct')
            ->setParameter('text', '%' . $text . '%')
            ->setParameter('statusSeller', 'available')
            ->setParameter('statusProduct', 'available')
            ->getQuery()
            ->getResult();
    }
}
