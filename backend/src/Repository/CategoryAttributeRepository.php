<?php

namespace App\Repository;

use App\Entity\CategoryAttribute;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<CategoryAttribute>
 */
class CategoryAttributeRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, CategoryAttribute::class);
    }

    public function findByCategory(int $categoryId): array
    {
        return $this->createQueryBuilder('ca')
            ->select('ca.attribute_key', 'ca.isRequired')
            ->andWhere('ca.category = :categoryId')
            ->setParameter('categoryId', $categoryId)
            ->getQuery()
            ->getResult();
    }
}
