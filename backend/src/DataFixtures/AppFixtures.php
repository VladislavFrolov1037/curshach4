<?php

namespace App\DataFixtures;

use App\Entity\Category;
use App\Entity\CategoryAttribute;
use App\Entity\Product;
use App\Entity\ProductAttribute;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class AppFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        $category = new Category();
        $category->setName('Техника');
        $manager->persist($category);
        $manager->flush();

        $subcategory = new Category();
        $subcategory->setName('Телефоны');
        $subcategory->setParentCategory($category);
        $manager->persist($subcategory);
        $manager->flush();

        $attributeModel = new CategoryAttribute();
        $attributeModel->setAttributeKey('Модель');
        $attributeModel->setIsRequired(1);
        $attributeModel->setCategory($subcategory);
        $manager->persist($attributeModel);
        $manager->flush();

        $attributeBrand = new CategoryAttribute();
        $attributeBrand->setAttributeKey('Марка');
        $attributeBrand->setIsRequired(true);
        $attributeBrand->setCategory($subcategory);
        $manager->persist($attributeBrand);
        $manager->flush();

        $product = new Product();
        $product->setName('iPhone 13');
        $product->setDescription('Мощный смартфон с отличной камерой');
        $product->setPrice(999.99);
        $product->setQuantity(10);
        $product->setImage('iphone13.jpg');
        $product->setCategory($subcategory);
        $manager->persist($product);
        $manager->flush();

        $productAttributeModel = new ProductAttribute();
        $productAttributeModel->setAttributeKey('Модель');
        $productAttributeModel->setValue('iPhone 13');
        $productAttributeModel->setProduct($product);
        $manager->persist($productAttributeModel);

        $productAttributeBrand = new ProductAttribute();
        $productAttributeBrand->setAttributeKey('Марка');
        $productAttributeBrand->setValue('Apple');
        $productAttributeBrand->setProduct($product);
        $manager->persist($productAttributeBrand);
        $manager->flush();

        $manager->flush();
    }
}
