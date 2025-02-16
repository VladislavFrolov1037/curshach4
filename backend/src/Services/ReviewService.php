<?php

namespace App\Services;

use App\Entity\Feedback;
use App\Repository\OrderRepository;
use App\Repository\ProductRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\SecurityBundle\Security;

class ReviewService
{
    public function __construct(private EntityManagerInterface $em, private Security $security, private readonly ProductRepository $productRepository, private readonly OrderRepository $orderRepository)
    {
    }

    public function createReview(array $data): Feedback
    {
        $user = $this->security->getUser();
        $product = $this->productRepository->find($data['productId']);

//        if ($this->orderRepository->hasUserReceivedProduct($user, $product)) {
//            throw new \Exception("Вы не можете оставить отзыв на товар который не заказывали");
//        }

        $review = (new Feedback())
            ->setUser($user)
            ->setProduct($product)
            ->setRating($data['rating'])
            ->setComment('' !== $data['comment'] ? $data['comment'] : null)
            ->setCreatedAt(new \DateTimeImmutable())
            ->setStatus('active')
            ->setImage($data['image'] ?? null);

        $this->em->persist($review);
        $this->em->flush();

        return $review;
    }
}
