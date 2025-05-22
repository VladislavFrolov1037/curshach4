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
                    'Кеды и кроссовки' => [
                        ['name' => 'Бренд', 'values' => ['Adidas', 'Nike', 'Versace',]],
                        ['name' => 'Размер обуви', 'values' => ['36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46']],
                        ['name' => 'Цвет', 'values' => ['Черный', 'Белый', 'Синий', 'Красный', 'Зеленый', 'Серый']],
                        ['name' => 'Материал', 'values' => ['Кожа', 'Текстиль', 'Замша', 'Резина']],
                    ],
                    'Сапоги' => [
                        ['name' => 'Бренд', 'values' => ['Ecco', 'Caterpillar', 'Timberland']],
                        ['name' => 'Размер обуви', 'values' => ['36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46']],
                        ['name' => 'Цвет', 'values' => ['Черный', 'Коричневый', 'Серый', 'Бежевый']],
                        ['name' => 'Материал', 'values' => ['Натуральная кожа', 'Замша', 'Резина']],
                    ],
                ],
                'Женская' => [
                    'Кеды и кроссовки' => [
                        ['name' => 'Бренд', 'values' => ['Adidas', 'Nike', 'Puma', 'Reebok']],
                        ['name' => 'Размер обуви', 'values' => ['35', '36', '37', '38', '39', '40', '41', '42']],
                        ['name' => 'Цвет', 'values' => ['Розовый', 'Белый', 'Черный', 'Золотистый', 'Серебристый']],
                    ],
                    'Босоножки' => [
                        ['name' => 'Бренд', 'values' => ['Gucci', 'Prada', 'Jimmy Choo']],
                        ['name' => 'Размер обуви', 'values' => ['35', '36', '37', '38', '39', '40', '41', '42']],
                        ['name' => 'Цвет', 'values' => ['Золотистый', 'Серебристый', 'Черный', 'Белый']],
                    ],
                ],
                'Детская' => [
                    'Кроссовки' => [
                        ['name' => 'Бренд', 'values' => ['Adidas', 'Nike', 'Reima']],
                        ['name' => 'Размер обуви', 'values' => ['20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34']],
                        ['name' => 'Цвет', 'values' => ['Синий', 'Розовый', 'Зеленый', 'Красный', 'Желтый']],
                    ],
                ],
            ],
            'Электроника' => [
                'Смартфоны' => [
                    ['name' => 'Бренд', 'values' => ['Apple', 'Samsung', 'Xiaomi']],
                    ['name' => 'Операционная система', 'values' => ['iOS', 'Android']],
                    ['name' => 'Диагональ экрана', 'values' => ['5.5"', '6.1"', '6.5"', '6.7"', '6.9"']],
                    ['name' => 'Объем памяти', 'values' => ['64 ГБ', '128 ГБ', '256 ГБ', '512 ГБ']],
                    ['name' => 'Цвет', 'values' => ['Черный', 'Белый', 'Синий', 'Зеленый', 'Красный', 'Фиолетовый']],
                ],
                'Ноутбуки и компьютеры' => [
                    'Ноутбуки' => [
                        ['name' => 'Бренд', 'values' => ['Apple', 'Asus', 'Lenovo']],
                        ['name' => 'Тип', 'values' => ['Ультрабук', 'Игровой', 'Бизнес', 'Универсальный']],
                        ['name' => 'Диагональ экрана', 'values' => ['13"', '14"', '15.6"', '16"', '17.3"']],
                        ['name' => 'Процессор', 'values' => ['Intel Core i3', 'Intel Core i5', 'Intel Core i7', 'Intel Core i9', 'AMD Ryzen 5', 'AMD Ryzen 7']],
                    ],
                    'Компьютеры' => [
                        ['name' => 'Тип', 'values' => ['Десктоп', 'Моноблок', 'Мини-ПК']],
                        ['name' => 'Процессор', 'values' => ['Intel Core i3', 'Intel Core i5', 'Intel Core i7', 'Intel Core i9', 'AMD Ryzen 5', 'AMD Ryzen 7']],
                        ['name' => 'Видеокарта', 'values' => ['Встроенная', 'NVIDIA GeForce GTX', 'NVIDIA GeForce RTX', 'AMD Radeon']],
                    ],
                    'Мониторы' => [
                        ['name' => 'Бренд', 'values' => ['Samsung', 'LG']],
                        ['name' => 'Диагональ', 'values' => ['21.5"', '24"', '27"', '32"', '34"']],
                        ['name' => 'Разрешение', 'values' => ['Full HD', '2K', '4K', 'UltraWide']],
                    ],
                ],
                'Наушники' => [
                    ['name' => 'Бренд', 'values' => ['Apple', 'Sony', 'Samsung']],
                    ['name' => 'Тип', 'values' => ['Вкладыши', 'Накладные', 'Полноразмерные', 'Беспроводные', 'TWS']],
                    ['name' => 'Цвет', 'values' => ['Черный', 'Белый', 'Синий', 'Красный', 'Бежевый']],
                ],
            ],
            'Одежда' => [
                'Мужская' => [
                    'Верхняя одежда' => [
                        ['name' => 'Бренд', 'values' => ['The North Face', 'Columbia', 'Canada Goose', 'Zara', 'H&M']],
                        ['name' => 'Тип', 'values' => ['Пальто', 'Пуховик', 'Куртка', 'Парка', 'Тренч']],
                        ['name' => 'Размер', 'values' => ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL']],
                        ['name' => 'Цвет', 'values' => ['Черный', 'Синий', 'Коричневый', 'Серый', 'Бежевый']],
                        ['name' => 'Материал', 'values' => ['Полиэстер', 'Нейлон', 'Шерсть', 'Хлопок']],
                    ],
                    'Брюки' => [
                        ['name' => 'Бренд', 'values' => ['Levi\'s', 'Diesel', 'Calvin Klein', 'Tommy Hilfiger']],
                        ['name' => 'Тип', 'values' => ['Джинсы', 'Чинос', 'Классические', 'Спортивные']],
                        ['name' => 'Размер', 'values' => ['28/30', '30/32', '32/34', '34/36', '36/38']],
                        ['name' => 'Цвет', 'values' => ['Синий', 'Черный', 'Серый', 'Бежевый', 'Коричневый']],
                    ],
                ],
                'Женская' => [
                    'Платья' => [
                        ['name' => 'Бренд', 'values' => ['Zara', 'Mango', 'H&M', 'Gucci', 'Dior']],
                        ['name' => 'Тип', 'values' => ['Повседневное', 'Вечернее', 'Летнее', 'Офисное']],
                        ['name' => 'Размер', 'values' => ['XS', 'S', 'M', 'L', 'XL', 'XXL']],
                        ['name' => 'Цвет', 'values' => ['Черный', 'Белый', 'Красный', 'Синий', 'Зеленый', 'Цветочный']],
                    ],
                    'Юбки' => [
                        ['name' => 'Бренд', 'values' => ['Massimo Dutti', 'Bershka', 'Stradivarius']],
                        ['name' => 'Тип', 'values' => ['Карандаш', 'Мини', 'Миди', 'Макси', 'Плиссе']],
                        ['name' => 'Размер', 'values' => ['XS', 'S', 'M', 'L', 'XL']],
                        ['name' => 'Цвет', 'values' => ['Черный', 'Белый', 'Синий', 'Красный', 'В клетку']],
                    ],
                    'Топы и футболки' => [
                        ['name' => 'Бренд', 'values' => ['Uniqlo', 'COS', 'Other Stories']],
                        ['name' => 'Тип', 'values' => ['Майка', 'Топ', 'Футболка', 'Боди']],
                        ['name' => 'Размер', 'values' => ['XS', 'S', 'M', 'L', 'XL']],
                        ['name' => 'Цвет', 'values' => ['Белый', 'Черный', 'Бежевый', 'Полосатый']],
                    ],
                ],
            ],
            'Аксессуары' => [
                'Часы' => [
                    ['name' => 'Бренд', 'values' => ['Rolex', 'Omega', 'Casio', 'Swatch']],
                    ['name' => 'Тип', 'values' => ['Кварцевые', 'Механические', 'Смарт-часы']],
                    ['name' => 'Цвет корпуса', 'values' => ['Серебристый', 'Золотистый', 'Черный', 'Розовое золото']],
                ],
                'Украшения' => [
                    ['name' => 'Бренд', 'values' => ['Pandora', 'Swarovski', 'Tiffany']],
                    ['name' => 'Тип', 'values' => ['Кольцо', 'Серьги', 'Подвеска', 'Браслет']],
                    ['name' => 'Материал', 'values' => ['Серебро', 'Золото', 'Позолота', 'Нержавеющая сталь']],
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
