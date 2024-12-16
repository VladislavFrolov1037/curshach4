<?php

namespace App\Services;

use App\Entity\Favorite;
use App\Entity\Product;
use App\Repository\FavoriteRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\SecurityBundle\Security;

class FavoriteService
{
    public function __construct(private EntityManagerInterface $em, private readonly Security $security, private readonly FavoriteRepository $favoriteRepository)
    {
    }

    public function addFavorite(Product $product): Favorite
    {
        $user = $this->security->getUser();

        $favorite = $this->favoriteRepository->findOneBy(['user' => $user, 'product' => $product]);

        if (!$favorite) {
            $favorite = (new Favorite())
                ->setProduct($product)
                ->setUser($user)
                ->setCreatedAt(new \DateTimeImmutable());

            $this->em->persist($favorite);
            $this->em->flush();
        }

        return $favorite;
    }

    public function deleteFavorite(Product $product): void
    {
        $user = $this->security->getUser();

        $favorite = $this->favoriteRepository->findOneBy(['product' => $product, 'user' => $user]);
        $this->em->remove($favorite);
        $this->em->flush();
    }
}
