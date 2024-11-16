<?php

namespace App\Services;

use App\Dto\Seller\RegisterSellerDto;
use App\Entity\Seller;
use App\Enum\SellerStatus;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Security\Core\User\UserInterface;

class SellerService
{
    private EntityManagerInterface $entityManager;

    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }

    public function createSeller(RegisterSellerDto $dto, UserInterface $user): Seller
    {
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
            ->setAddress($dto->address);

        $this->entityManager->persist($seller);
        $this->entityManager->flush();

        return $seller;
}
}