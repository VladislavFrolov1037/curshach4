<?php

namespace App\DataFixtures;

use App\Repository\CategoryAttributeRepository;
use App\Repository\CategoryRepository;
use App\Repository\ProductAttributeRepository;
use App\Repository\ProductRepository;
use App\Repository\SellerRepository;
use App\Repository\UserRepository;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class AppFixtures extends Fixture
{
    public function __construct(private readonly CategoryRepository $categoryRepository, private readonly CategoryAttributeRepository $categoryAttributeRepository, private readonly UserPasswordHasherInterface $hasher, private readonly ProductAttributeRepository $productAttributeRepository, private readonly SellerRepository $sellerRepository, private readonly UserRepository $userRepository, private readonly ProductRepository $productRepository)
    {
    }

    public function load(ObjectManager $manager): void
    {
        $userFixtures = new UserFixtures($this->hasher);
        $userFixtures->load($manager);

        (new SellerFixtures($this->userRepository))->load($manager);
        $manager->flush();

        $categoryFixtures = new CategoryFixtures();
        $categoryFixtures->load($manager);

        $productFixtures = new ProductFixtures($this->categoryRepository, $this->categoryAttributeRepository, $this->productRepository, $this->productAttributeRepository, $this->sellerRepository);
        $productFixtures->load($manager);

        $manager->flush();
    }
}
