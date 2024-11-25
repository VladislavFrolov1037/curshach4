<?php

namespace App\DataFixtures;

use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class UserFixtures extends Fixture
{
    private UserPasswordHasherInterface $hasher;

    public function __construct(UserPasswordHasherInterface $hasher)
    {
        $this->hasher = $hasher;
    }

    public function load(ObjectManager $manager): void
    {
        $user = new User();
        $manager->persist($user
            ->setEmail("admin@bk.ru")
            ->setRoles(["ROLE_ADMIN"])
            ->setPassword($this->hasher->hashPassword($user, 'admin'))
            ->setName('admin')
            ->setGender('male')
            ->setPhone('89938543143')
            ->setCreatedAt(new \DateTimeImmutable())
        );

        $user = new User();
        $manager->persist($user
            ->setEmail("vladoperation@bk.ru")
            ->setRoles(["ROLE_USER"])
            ->setPassword($this->hasher->hashPassword($user, '1'))
            ->setName('vladislav')
            ->setGender('male')
            ->setPhone('89938543143')
            ->setCreatedAt(new \DateTimeImmutable())
        );

        $manager->flush();
    }
}
