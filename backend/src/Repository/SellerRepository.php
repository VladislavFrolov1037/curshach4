<?php

namespace App\Repository;

use App\Entity\Seller;
use App\Enum\SellerStatus;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Seller>
 */
class SellerRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Seller::class);
    }

    public function findApprovedSellersWithPositiveBalance(): array
    {
        return $this->createQueryBuilder('s')
            ->andWhere('s.balance > :balance')
            ->andWhere('s.status = :status')
            ->setParameter('balance', 0)
            ->setParameter('status', SellerStatus::APPROVED)
            ->getQuery()
            ->getResult();
    }
}
