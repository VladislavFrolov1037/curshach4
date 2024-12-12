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
        $results = $this->createQueryBuilder('ca')
            ->leftJoin('ca.validValues', 'vv')
            ->select('ca.id', 'ca.attribute_key', 'ca.isRequired', 'vv.value')
            ->andWhere('ca.category = :categoryId')
            ->setParameter('categoryId', $categoryId)
            ->getQuery()
            ->getResult();

        $grouped = [];
        foreach ($results as $result) {
            $key = $result['attribute_key'];
            if (!isset($grouped[$key])) {
                $grouped[$key] = [
                    'id' => $result['id'],
                    'attribute_key' => $key,
                    'isRequired' => $result['isRequired'],
                    'validValues' => [],
                ];
            }
            if (null !== $result['value']) {
                $grouped[$key]['validValues'][] = $result['value'];
            }
        }

        return array_values($grouped);
    }
}
