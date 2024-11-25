<?php

namespace App\Services;

use App\Dto\Seller\EditSellerDto;
use App\Dto\Seller\RegisterSellerDto;
use App\Entity\Seller;
use App\Enum\SellerStatus;
use App\Utils\EntityMapper;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\Security\Core\User\UserInterface;

class SellerService
{
    public function __construct(private EntityManagerInterface $em, private EntityMapper $entityMapper, private FileService $fileService)
    {
    }

    public function createSeller(RegisterSellerDto $dto, UserInterface $user): Seller
    {
        $user->setRoles(['ROLE_SELLER']);

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
            ->setImage($this->fileService->upload($dto->image))
            ->setBalance(0);

        $this->em->persist($user);
        $this->em->persist($seller);
        $this->em->flush();

        return $seller;
    }

    public function editSeller(EditSellerDto $dto, Seller $seller): Seller
    {
        $this->entityMapper->mapDtoToEntity($dto, $seller);

        $this->em->persist($seller);
        $this->em->flush();

        return $seller;
    }
}
