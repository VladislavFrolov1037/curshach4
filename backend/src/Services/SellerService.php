<?php

namespace App\Services;

use App\Dto\Seller\RegisterSellerDto;
use App\Entity\Seller;
use App\Enum\SellerStatus;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\SecurityBundle\Security;

class SellerService
{
    private EntityManagerInterface $entityManager;
    private Security $security;

    public function __construct(EntityManagerInterface $entityManager, Security $security)
    {
        $this->entityManager = $entityManager;
        $this->security = $security;
    }

    public function createSeller(RegisterSellerDto $dto): Seller
    {
        $user = $this->security->getUser();

        $seller = (new Seller())
            ->setName($dto->name)
            ->setDescription($dto->description)
            ->setStatus(SellerStatus::PENDING)
            ->setUser($user)
            ->setType($dto->type)
            ->setTaxId($dto->taxId)
            ->setPassport($dto->passport)
            ->setPhone($dto->phone)
            ->setEmail($dto->email)
            ->setAddress($dto->address)
            ->setImage($dto->image)
            ->setBalance(0);

        $this->entityManager->persist($seller);

        $this->entityManager->flush();

        return $seller;
    }
}