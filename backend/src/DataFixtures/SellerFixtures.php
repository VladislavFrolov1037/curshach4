<?php

namespace App\DataFixtures;

use App\Entity\Seller;
use App\Entity\User;
use App\Enum\SellerStatus;
use App\Repository\UserRepository;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class SellerFixtures extends Fixture
{
    public function __construct(private readonly UserRepository $userRepository)
    {
    }

    public function load(ObjectManager $manager): void
    {
        $seller = new Seller();
        $manager->persist($seller
            ->setEmail('admin1@bk.ru')
            ->setName('admin')
            ->setDescription('admin')
            ->setStatus(SellerStatus::PENDING)
            ->setType('individual')
            ->setTaxId('515155')
            ->setPassport(7518125252)
            ->setBalance(0)
            ->setAddress('Washington, D.C.')
            ->setImage('uploads/674aaf7b80849.png')
            ->setUser($this->userRepository->findAll()[0])
            ->setPhone('89938543143')
        );
    }
}
