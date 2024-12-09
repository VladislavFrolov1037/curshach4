<?php

namespace App\DataFixtures;

use App\Entity\Image;
use App\Entity\Product;
use App\Entity\ProductAttribute;
use App\Enum\ProductStatus;
use App\Repository\CategoryAttributeRepository;
use App\Repository\CategoryRepository;
use App\Repository\ProductAttributeRepository;
use App\Repository\SellerRepository;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Faker\Factory;

class ProductFixtures extends Fixture
{
    public function __construct(
        private readonly CategoryRepository          $categoryRepository,
        private readonly CategoryAttributeRepository $categoryAttributeRepository,
        private readonly ProductAttributeRepository  $productAttributeRepository, private readonly SellerRepository $sellerRepository,
    ) {
    }

    public function load(ObjectManager $manager): void
    {
        $faker = Factory::create();

        $categories = $this->categoryRepository->findCategoriesWithFields();

        foreach ($categories as $category) {
            $categoryAttributes = $this->categoryAttributeRepository->findByCategory($category->getId());

            for ($i = 0; $i < 12; ++$i) {
                $product = new Product();
                $product->setName($category->getName().' товар '.$i);
                $product->setDescription('Описание товара №'.$i);
                $product->setPrice(rand(100, 1000).'.00');
                $product->setQuantity(rand(1, 100));
                $product->setCategory($category);
                $product->setStatus(ProductStatus::STATUS_AVAILABLE);
                $product->setViewsCount(0);
                $product->setSeller($this->sellerRepository->findAll()[0]);

                $manager->persist($product);

                $images = ['uploads/Кроссовки 1.png', 'uploads/Кроссовки 2.png'];
                $randKey = array_rand($images);

                $image = new Image();
                $image->setProduct($product);
                $image->setSequence(1);
                $image->setUrl($images[$randKey]);

                $manager->persist($image);

                foreach ($categoryAttributes as $attribute) {
                    $productAttribute = new ProductAttribute();
                    $productAttribute->setProduct($product);
                    $productAttribute->setAttributeKey($attribute['attribute_key']);

                    if (!empty($attribute['validValues'])) {
                        $randomValue = $attribute['validValues'][array_rand($attribute['validValues'])];
                        $productAttribute->setValue($randomValue);
                    } else {
                        $productAttribute->setValue($faker->word);
                    }

                    $manager->persist($productAttribute);
                }
            }
        }

        $manager->flush();
    }
}
