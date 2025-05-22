<?php

namespace App\DataFixtures;

use App\Entity\Category;
use App\Entity\Image;
use App\Entity\Product;
use App\Entity\ProductAttribute;
use App\Entity\Seller;
use App\Enum\ProductStatus;
use App\Repository\CategoryAttributeRepository;
use App\Repository\CategoryRepository;
use App\Repository\ProductAttributeRepository;
use App\Repository\ProductRepository;
use App\Repository\SellerRepository;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Faker\Factory;

class ProductFixtures extends Fixture
{
    private const CATEGORY_STRUCTURE = [
        'Обувь' => [
            'Мужская' => [
                'Кеды и кроссовки' => [
                    ['name' => 'Бренд', 'values' => ['Adidas', 'Nike', 'Versace']],
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

    private const IMAGE_PATHS = [
        'Обувь' => [
            'Мужская' => [
                'Кеды и кроссовки' => [
                    'Adidas' => ['uploads/adidas1.webp', 'uploads/adidas2.webp'],
                    'Versace' => ['uploads/versace1.jpg'],
                ],
                'Сапоги' => [
                    'Caterpillar' => ['uploads/caterpillar1.jpg'],
                    'Timberland' => ['uploads/timberland1.jpg'],
                ],
            ],
            'Женская' => [
                'Кеды и кроссовки' => [
                    'Adidas' => ['uploads/adidas3.webp', 'uploads/adidas4.webp'],
                    'Nike' => ['uploads/nike1.webp'],
                ],
                'Босоножки' => [
                    'Gucci' => ['uploads/gucci1.jpg'],
                    'Prada' => ['uploads/prada1.jpg'],
                ],
            ],
            'Детская' => [
                'Кроссовки' => [
                    'Adidas' => ['uploads/adidas5.jpg'],
                ],
            ],
        ],
        'Электроника' => [
            'Смартфоны' => [
                'Apple' => ['uploads/iphone1.webp', 'uploads/iphone2.webp'],
                'Samsung' => ['uploads/samsung1.jpg'],
                'Xiaomi' => ['uploads/xiaomi1.png'],
            ],
            'Ноутбуки и компьютеры' => [
                'Ноутбуки' => [
                    'Apple' => ['uploads/macbook1.jpg'],
                    'Asus' => ['uploads/asus1.jpg'],
                    'Lenovo' => ['uploads/lenovo1.jpg'],
                ],
                'Компьютеры' => [
                    'default' => ['uploads/computer1.webp'],
                ],
                'Мониторы' => [
                    'Samsung' => ['uploads/samsung1.webp'],
                    'LG' => ['uploads/lg1.webp'],
                ],
            ],
            'Наушники' => [
                'Apple' => ['uploads/airpods1.jpg'],
                'Samsung' => ['uploads/samsung2.jpg'],
            ],
        ],
        'Одежда' => [
            'Мужская' => [
                'Верхняя одежда' => [
                    'The North Face' => ['uploads/northface1.jpg'],
                    'H&M' => ['uploads/hm1.webp'],
                ],
                'Брюки' => [
                    'Calvin Klein' => ['uploads/ck1.webp'],
                    'Tommy Hilfiger' => ['uploads/tommy1.webp'],
                ],
            ],
            'Женская' => [
                'Платья' => [
                    'Gucci' => ['uploads/gucci2.jpg'],
                    'Dior' => ['uploads/dior1.jpg'],
                ],
                'Юбки' => [
                    'Massimo Dutti' => ['uploads/massimo1.jpg'],
                    'Stradivarius' => ['uploads/stradivarius1.jpg'],
                ],
                'Топы и футболки' => [
                    'Uniqlo' => ['uploads/uniqlo1.jpg'],
                    'COS' => ['uploads/cos1.jpg'],
                ],
            ],
        ],
        'Аксессуары' => [
            'Часы' => [
                'Rolex' => ['uploads/rolex1.jpg'],
                'Casio' => ['uploads/casio1.jpg'],
            ],
            'Украшения' => [
                'Swarovski' => ['uploads/swarovski1.jpg'],
                'Tiffany' => ['uploads/tiffany1.jpg'],
            ],
        ],
    ];

    public function __construct(
        private readonly CategoryRepository          $categoryRepository,
        private readonly CategoryAttributeRepository $categoryAttributeRepository,
        private readonly ProductRepository           $productRepository,
        private readonly ProductAttributeRepository  $productAttributeRepository,
        private readonly SellerRepository            $sellerRepository,
    )
    {
    }

    public function load(ObjectManager $manager): void
    {
        $faker = Factory::create('ru_RU');
        $seller = $this->getOrCreateSeller($manager);

        $categories = $this->categoryRepository->findAll();

        foreach ($categories as $category) {
            $categoryPath = $this->getCategoryPath($category);
            $pathParts = explode('/', $categoryPath);

            $lastCategoryName = end($pathParts);

            $gender = $this->getGenderFromPath($pathParts);

            $categoryAttributes = $this->getCategoryAttributesFromPath($pathParts);

            if (empty($categoryAttributes)) {
                continue;
            }

            $brands = $this->getBrandsFromAttributes($categoryAttributes);

            foreach ($brands as $brand) {
                $images = $this->getImagesForBrand($pathParts, $brand);

                if (empty($images)) {
                    $images = ['uploads/default_product.jpg'];
                }

                $productName = $brand . ' ' . $lastCategoryName;
                $this->createProduct(
                    $productName,
                    $category,
                    $images,
                    $categoryAttributes,
                    $seller,
                    $manager,
                    $faker,
                    $brand
                );
            }
        }

    }


    private function getCategoryPath(Category $category): string
    {
        $path = [];
        $current = $category;

        while ($current !== null) {
            array_unshift($path, $current->getName());
            $current = $current->getParentCategory();
        }

        return implode('/', $path);
    }

    private function getGenderFromPath(array $pathParts): ?string
    {
        $genders = ['Мужская', 'Женская', 'Детская'];

        foreach ($pathParts as $part) {
            if (in_array($part, $genders)) {
                return $part;
            }
        }

        return null;
    }

    private function getCategoryAttributesFromPath(array $pathParts): array
    {
        $currentLevel = self::CATEGORY_STRUCTURE;

        foreach ($pathParts as $part) {
            if (isset($currentLevel[$part])) {
                $currentLevel = $currentLevel[$part];
            } else {
                if ($this->isAttributesLevel($currentLevel)) {
                    return $currentLevel;
                }
                return [];
            }
        }

        return $this->isAttributesLevel($currentLevel) ? $currentLevel : [];
    }

    private function isAttributesLevel($level): bool
    {
        if (!is_array($level) || empty($level)) {
            return false;
        }

        return isset($level[0]['name']) && isset($level[0]['values']);
    }

    private function getBrandsFromAttributes(array $attributes): array
    {
        foreach ($attributes as $attribute) {
            if ($attribute['name'] === 'Бренд') {
                return $attribute['values'];
            }
        }
        return [];
    }

    private function getImagesForBrand(array $fullPath, string $brand): array
    {
        $currentLevel = self::IMAGE_PATHS;

        foreach ($fullPath as $pathPart) {
            if (isset($currentLevel[$pathPart])) {
                $currentLevel = $currentLevel[$pathPart];
            } else {
                return [];
            }
        }

        if (isset($currentLevel[$brand])) {
            return $currentLevel[$brand];
        } elseif (isset($currentLevel['default'])) {
            return $currentLevel['default'];
        }

        return [];
    }

    private function getOrCreateSeller(ObjectManager $manager): Seller
    {
        $seller = $this->sellerRepository->findOneBy([]);

        if (!$seller) {
            $seller = new Seller();
            $seller->setName('Основной продавец');
            $seller->setEmail('seller@example.com');
            $seller->setPhone('+79001234567');
            $manager->persist($seller);
            $manager->flush();
        }

        return $seller;
    }

    private function createProduct(
        string        $name,
                      $category,
        array         $images,
        array         $categoryAttributes,
        Seller        $seller,
        ObjectManager $manager,
                      $faker,
        ?string       $brand = null
    ): void
    {
        $product = new Product();
        $product->setName($name);
        $product->setDescription($faker->sentence(10));
        $product->setPrice((string)(rand(1000, 100000) / 100));
        $product->setQuantity(rand(1, 100));
        $product->setCategory($category);
        $product->setStatus(ProductStatus::STATUS_AVAILABLE);
        $product->setViewsCount(0);
        $product->setSeller($seller);

        $manager->persist($product);

        $image = (new Image())
            ->setProduct($product)
            ->setUrl($images[0]);
        $manager->persist($image);

        foreach ($categoryAttributes as $attributeData) {
            $attribute = new ProductAttribute();
            $attribute->setProduct($product);
            $attribute->setAttributeKey($attributeData['name']);

            if ($attributeData['name'] === 'Бренд' && $brand) {
                $attribute->setValue($brand);
            } else {
                $randomValue = $attributeData['values'][array_rand($attributeData['values'])];
                $attribute->setValue($randomValue);
            }

            $manager->persist($attribute);
        }
    }
}
