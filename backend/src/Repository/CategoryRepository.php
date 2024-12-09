<?php

namespace App\Repository;

use App\Entity\Category;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Category>
 */
class CategoryRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Category::class);
    }

    public function findCategoriesWithFields()
    {
        return $this->createQueryBuilder('c')
            ->leftJoin('c.categoryAttributes', 'ca')
            ->leftJoin('ca.validValues', 'vv')
            ->addSelect('ca')
            ->where('c.parentCategory IS NOT NULL')
            ->andWhere('vv.value IS NOT NULL')
            ->getQuery()
            ->getResult();
    }

    public function findCategoryTree(): array
    {
        $categories = $this->createQueryBuilder('c')
            ->leftJoin('c.parentCategory', 'p')
            ->addSelect('p')
            ->getQuery()
            ->getResult();

        $categoryMap = [];
        foreach ($categories as $category) {
            $categoryMap[$category->getId()] = [
                'id' => $category->getId(),
                'name' => $category->getName(),
                'icon' => $category->getIcon(),
                'subcategories' => [],
            ];
        }

        $tree = [];
        foreach ($categories as $category) {
            $parent = $category->getParentCategory();
            if ($parent) {
                $categoryMap[$parent->getId()]['subcategories'][] = &$categoryMap[$category->getId()];
            } else {
                $tree[] = &$categoryMap[$category->getId()];
            }
        }

        return $tree;
    }
}
