<?php

namespace App\Repository;

use App\Entity\Order;
use App\Entity\Product;
use App\Entity\User;
use App\Enum\OrderStatus;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\QueryBuilder;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\Security\Core\User\UserInterface;

/**
 * @extends ServiceEntityRepository<Order>
 */
class OrderRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Order::class);
    }

    public function findUserOrders(UserInterface $user, string $status)
    {
        $qb = $this->createQueryBuilder('o')
            ->andWhere('o.user = :user')
            ->setParameter('user', $user);

        return $this->applyFilters($qb, $status);
    }

    public function applyFilters(QueryBuilder $qb, string $status)
    {
        if ('end' === $status) {
            $qb->andWhere('o.status IN (:statuses)')
                ->setParameter('statuses', [OrderStatus::STATUS_CANCELLED, OrderStatus::STATUS_DELIVERED]);
        } else {
            $qb->andWhere('o.status NOT IN (:statuses)')
                ->setParameter('statuses', [OrderStatus::STATUS_CANCELLED, OrderStatus::STATUS_DELIVERED]);
        }

        return $qb->getQuery()->getResult();
    }

    public function hasUserReceivedProduct(UserInterface $user, Product $product): bool
    {
        return (bool) $this->createQueryBuilder('o')
            ->select('COUNT(o.id)')
            ->innerJoin('o.orderItems', 'oi')
            ->where('o.user = :user')
            ->andWhere('oi.product = :product')
            ->andWhere('o.status = :status')
            ->setParameter('user', $user)
            ->setParameter('product', $product)
            ->setParameter('status', 'delivered')
            ->getQuery()
            ->getSingleScalarResult();
    }


    //    /**
    //     * @return Order[] Returns an array of Order objects
    //     */
    //    public function findByExampleField($value): array
    //    {
    //        return $this->createQueryBuilder('o')
    //            ->andWhere('o.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->orderBy('o.id', 'ASC')
    //            ->setMaxResults(10)
    //            ->getQuery()
    //            ->getResult()
    //        ;
    //    }

    //    public function findOneBySomeField($value): ?Order
    //    {
    //        return $this->createQueryBuilder('o')
    //            ->andWhere('o.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }
}
