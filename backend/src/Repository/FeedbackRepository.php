<?php

namespace App\Repository;

use App\Entity\Feedback;
use App\Entity\Product;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\Security\Core\User\UserInterface;

/**
 * @extends ServiceEntityRepository<Feedback>
 */
class FeedbackRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Feedback::class);
    }

    public function hasProductReviewFromUser(UserInterface $user, Product $product): bool
    {
        return (bool) $this->createQueryBuilder('f')
            ->select('COUNT(f.id)')
            ->andWhere('f.user = :user')
            ->andWhere('f.product = :product')
            ->setParameter('user', $user)
            ->setParameter('product', $product)
            ->getQuery()
            ->getSingleScalarResult();
    }

    public function getFeedbacksForProduct(Product $product, UserInterface $user): array
    {
        $qb = $this->createQueryBuilder('f')
            ->andWhere('f.product = :product')
            ->setParameter('product', $product);

        $currentUserFeedback = $qb
            ->andWhere('f.user = :user')
            ->setParameter('user', $user)
            ->getQuery()
            ->getResult();

        $otherFeedbacks = $this->createQueryBuilder('f')
            ->andWhere('f.product = :product')
            ->andWhere('f.user != :user')
            ->setParameter('product', $product)
            ->setParameter('user', $user)
            ->getQuery()
            ->getResult();

        return array_merge($currentUserFeedback, $otherFeedbacks);
    }

    public function getProductRating(Product $product)
    {
        return $this->createQueryBuilder('f')
            ->select('AVG(f.rating) as rating, COUNT(f.id) as count')
            ->andWhere('f.product = :product')
            ->setParameter('product', $product)
            ->getQuery()
            ->getOneOrNullResult();
    }
}
