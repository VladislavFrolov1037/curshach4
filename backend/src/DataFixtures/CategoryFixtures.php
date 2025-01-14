<?php

namespace App\DataFixtures;

use App\Entity\Category;
use App\Entity\CategoryAttribute;
use App\Entity\ValidValue;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class CategoryFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        $categories = [
            'Обувь' => [
                'Мужская' => [
                    'Кеды' => [
                        ['name' => 'Бренд', 'values' => ['Adidas', 'Nike']],
                        ['name' => 'Размер обуви', 'values' => ['36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46']],
                        ['name' => 'Цвет', 'values' => null],
                        ['name' => 'Материал', 'values' => null],
                    ],
                    'Кроссовки' => [
                        ['name' => 'Бренд', 'values' => ['Adidas', 'Nike']],
                        ['name' => 'Размер обуви', 'values' => ['36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46']],
                        ['name' => 'Сезон', 'values' => ['Лето', 'Зима']],
                        ['name' => 'Цвет', 'values' => null],
                        ['name' => 'Материал', 'values' => null],
                    ],
                ],
                'Женская' => [
                    'Кеды' => [
                        ['name' => 'Бренд', 'values' => ['Adidas', 'Nike']],
                        ['name' => 'Размер обуви', 'values' => ['36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46']],
                        ['name' => 'Цвет', 'values' => null],
                        ['name' => 'Материал', 'values' => null],
                    ],
                    'Кроссовки' => [
                        ['name' => 'Бренд', 'values' => ['Adidas', 'Nike']],
                        ['name' => 'Размер обуви', 'values' => ['36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46']],
                        ['name' => 'Сезон', 'values' => ['Лето', 'Зима']],
                        ['name' => 'Цвет', 'values' => null],
                        ['name' => 'Материал', 'values' => null],
                    ],
                ],
            ],
            'Электроника' => [
                'Телефоны' => [
                    ['name' => 'Бренд', 'values' => ['Apple', 'Samsung', 'Xiaomi']],
                    ['name' => 'Операционная система', 'values' => ['iOS', 'Android']],
                    ['name' => 'Диагональ экрана', 'values' => ['5.5"', '6.1"', '6.7"']],
                ],
                'Ноутбуки' => [
                    ['name' => 'Бренд', 'values' => ['Apple', 'Dell', 'HP']],
                    ['name' => 'Процессор', 'values' => ['Intel', 'AMD']],
                    ['name' => 'Оперативная память', 'values' => ['8GB', '16GB', '32GB']],
                ],
            ],
            'Одежда' => [
                'Женская' => [
                ],
            ],
        ];

        $this->createCategories($categories, null, $manager);
        $manager->flush();
    }

    private function createCategories(array $categories, ?Category $parentCategory, ObjectManager $manager): void
    {
        foreach ($categories as $categoryName => $subcategoriesOrAttributes) {
            $category = $this->findOrCreateCategory($categoryName, $parentCategory, $manager);

            if (isset($subcategoriesOrAttributes[0]) && is_array($subcategoriesOrAttributes[0]) && isset($subcategoriesOrAttributes[0]['name'])) {
                foreach ($subcategoriesOrAttributes as $attribute) {
                    $this->setAttributeModel($attribute['name'], true, $category, $manager, $attribute['values']);
                }
            } else {
                $this->createCategories($subcategoriesOrAttributes, $category, $manager);
            }
        }
    }

    private function findOrCreateCategory(string $name, ?Category $parentCategory, ObjectManager $manager): Category
    {
        $repository = $manager->getRepository(Category::class);
        $existingCategory = $repository->findOneBy([
            'name' => $name,
            'parentCategory' => $parentCategory,
        ]);

        if ($existingCategory) {
            return $existingCategory;
        }

        $category = new Category();
        $category->setName($name);
        $category->setParentCategory($parentCategory);
        $manager->persist($category);

        return $category;
    }

    private function setAttributeModel(string $name, bool $isRequired, Category $category, ObjectManager $manager, ?array $values = null): void
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
