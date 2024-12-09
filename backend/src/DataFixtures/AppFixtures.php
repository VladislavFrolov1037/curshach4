<?php

namespace App\DataFixtures;

use App\Entity\Category;
use App\Entity\CategoryAttribute;
use App\Entity\ValidValue;
use App\Repository\CategoryAttributeRepository;
use App\Repository\CategoryRepository;
use App\Repository\ProductAttributeRepository;
use App\Repository\SellerRepository;
use App\Repository\UserRepository;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class AppFixtures extends Fixture
{
    public function __construct(private readonly CategoryRepository $categoryRepository, private readonly CategoryAttributeRepository $categoryAttributeRepository, private readonly UserPasswordHasherInterface $hasher, private readonly ProductAttributeRepository $productAttributeRepository, private readonly SellerRepository $sellerRepository, private readonly UserRepository $userRepository)
    {
    }

    public function load(ObjectManager $manager): void
    {
        $userFixturess = new UserFixtures($this->hasher);
        $userFixturess->load($manager);

        $shoesCategory = new Category();
        $shoesCategory->setName('Обувь');
        $manager->persist($shoesCategory);

        $manShoes = new Category();
        $manShoes->setName('Мужская');
        $manShoes->setParentCategory($shoesCategory);
        $manager->persist($manShoes);

        $category = new Category();
        $category->setName('Кеды');
        $category->setParentCategory($manShoes);
        $manager->persist($category);

        $this->setAttributeModel('Бренд', true, $category, $manager, ['Adidas', 'Nike']);
        $this->setAttributeModel('Размер обуви', true, $category, $manager, ['36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46']);
        $this->setAttributeModel('Цвет', true, $category, $manager);
        $this->setAttributeModel('Материал', true, $category, $manager);

        $category = new Category();
        $category->setName('Кроссовки');
        $category->setParentCategory($manShoes);
        $manager->persist($category);

        $this->setAttributeModel('Бренд', true, $category, $manager, ['Adidas', 'Nike']);
        $this->setAttributeModel('Размер обуви', true, $category, $manager, ['36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46']);
        $this->setAttributeModel('Сезон', true, $category, $manager, ['Лето', 'Зима']);
        $this->setAttributeModel('Цвет', true, $category, $manager);
        $this->setAttributeModel('Материал', true, $category, $manager);


        (new SellerFixtures($this->userRepository))->load($manager);
        $manager->flush();

        $productFixtures = new ProductFixtures($this->categoryRepository, $this->categoryAttributeRepository, $this->productAttributeRepository, $this->sellerRepository);
        $productFixtures->load($manager);
    }

    public function setAttributeModel(string $name, bool $isRequired, Category $category, ObjectManager $manager, ?array $values = null): void
    {
        $attributeModel = new CategoryAttribute();
        $attributeModel->setAttributeKey($name);
        $attributeModel->setIsRequired($isRequired);
        $attributeModel->setCategory($category);
        $manager->persist($attributeModel);

        if ($values) {
            foreach ($values as $value) {
                $validValue = new ValidValue();
                $validValue->setCategoryAttribute($attributeModel);
                $validValue->setValue($value);
                $manager->persist($validValue);
            }
        }
    }
}
