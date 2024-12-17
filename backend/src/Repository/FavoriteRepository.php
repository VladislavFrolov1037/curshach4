<?php

namespace App\Repository;

use App\Entity\Favorite;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\Security\Core\User\UserInterface;

/**
 * @extends ServiceEntityRepository<Favorite>
 */
class FavoriteRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Favorite::class);
    }

    public function findByFilter(UserInterface $user, $sortOption)
    {
        $qb = $this->createQueryBuilder('f')
            ->leftJoin('f.product', 'p')
            ->andWhere('f.user = :user')
            ->setParameter('user', $user);

        switch ($sortOption) {
            case 'date_asc':
                $qb->orderBy('f.createdAt', 'ASC');
                break;
            case 'date_desc':
                $qb->orderBy('f.createdAt', 'DESC');
                break;
            case 'price_asc':
                $qb->orderBy('p.price', 'ASC');
                break;
            case 'price_desc':
                $qb->orderBy('p.price', 'DESC');
                break;
            default:
                $qb->orderBy('f.createdAt', 'DESC');
        }

        return $qb->getQuery()->getResult();
    }
}
