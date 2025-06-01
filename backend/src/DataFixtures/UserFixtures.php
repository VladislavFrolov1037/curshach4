<?php

namespace App\DataFixtures;

use App\Entity\Cart;
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
        $existingUser = $manager->getRepository(User::class)->findOneBy(['email' => 'admin@bk.ru']);
        if (!$existingUser) {
            $user = new User();
            $manager->persist($user
                ->setEmail('admin@bk.ru')
                ->setRoles(['ROLE_ADMIN', 'ROLE_SELLER'])
                ->setPassword($this->hasher->hashPassword($user, 'admin'))
                ->setName('admin')
                ->setGender('male')
                ->setPhone('89938543143')
                ->setCreatedAt(new \DateTimeImmutable())
            );

            $cart = new Cart();
            $cart->setUser($user);
            $cart->setTotalPrice(0);
            $manager->persist($cart);
        }



        $existingUser2 = $manager->getRepository(User::class)->findOneBy(['email' => 'vladoperation@bk.ru']);
        if (!$existingUser2) {
            $user = new User();
            $manager->persist($user
                ->setEmail('vladoperation@bk.ru')
                ->setRoles(['ROLE_USER'])
                ->setPassword($this->hasher->hashPassword($user, '111111'))
                ->setName('vladislav')
                ->setGender('male')
                ->setPhone('89938543143')
                ->setCreatedAt(new \DateTimeImmutable())
            );

            $cart = new Cart();
            $cart->setUser($user);
            $cart->setTotalPrice(0);
            $manager->persist($cart);
        }

        $manager->flush();
    }
}
