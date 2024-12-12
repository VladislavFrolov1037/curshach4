<?php

namespace App\Services;

use App\Dto\Product\CreateProductDto;
use App\Dto\Product\EditProductDto;
use App\Entity\Image;
use App\Entity\Product;
use App\Entity\ProductAttribute;
use App\Entity\ViewedProduct;
use App\Enum\ProductStatus;
use App\Exception\ValidationException;
use App\Repository\CategoryAttributeRepository;
use App\Repository\CategoryRepository;
use App\Repository\ProductAttributeRepository;
use App\Repository\ViewedProductRepository;
use App\Utils\EntityMapper;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\Validator\ConstraintViolation;
use Symfony\Component\Validator\Validator\ValidatorInterface;

class ProductService
{
    public function __construct(
        private EntityManagerInterface $em,
        private ValidatorInterface $validator,
        private FileService $fileService,
        private Security $security,
        private CategoryAttributeRepository $categoryAttributeRepository,
        private CategoryRepository $categoryRepository,
        private readonly EntityMapper $entityMapper, private readonly ProductAttributeRepository $productAttributeRepository,
        private ViewedProductRepository $viewedProductRepository,
    ) {
    }

    public function createProduct(array $data): Product
    {
        $dto = new CreateProductDto();

        $additionalAttributes = $this->categoryAttributeRepository->findByCategory($data['categoryId']);
        $categoryAttributes = $data['categoryAttributes'] ?? [];
        $additionalProductAttributes = $data['additionalProductAttributes'] ?? [];

        $dto->name = $data['name'] ?? null;
        $dto->description = $data['description'] ?? null;
        $dto->price = $data['price'] ?? null;
        $dto->quantity = $data['quantity'] ?? null;
        $dto->images = $data['images'] ?? null;
        $dto->orders = $data['orders'] ?? null;
        $dto->categoryId = $data['categoryId'] ?? null;

        $errors = $this->validator->validate($dto);

        foreach ($additionalAttributes as $attribute) {
            $key = $attribute['attribute_key'];
            $categoryAttributeValue = $categoryAttributes[$key] ?? null;

            if (empty($categoryAttributeValue) && $attribute['isRequired']) {
                $errors[] = new ConstraintViolation(
                    "{$key} — обязательное поле.",
                    null,
                    [],
                    null,
                    $key,
                    $categoryAttributeValue
                );
            }

            if (isset($categoryAttributeValue) && !empty($attribute['validValues']) && !in_array($categoryAttributeValue, $attribute['validValues'])) {
                $errors[] = new ConstraintViolation(
                    "{$key} — не может содержать данное значение.",
                    null,
                    [],
                    null,
                    $key,
                    $categoryAttributeValue
                );
            }
        }

        if (count($errors) > 0) {
            throw new ValidationException($errors);
        }

        $product = (new Product())
            ->setName($dto->name)
            ->setDescription($dto->description)
            ->setPrice($dto->price)
            ->setQuantity($dto->quantity)
            ->setSeller($this->security->getUser()->getSeller())
            ->setCategory($this->categoryRepository->find($dto->categoryId))
            ->setStatus(ProductStatus::STATUS_AVAILABLE)
            ->setViewsCount(0);

        $this->em->persist($product);

        foreach ($dto->images as $index => $image) {
            $filePath = $this->fileService->upload($image);
            $order = $index + 1;

            $productImage = (new Image())
                ->setUrl($filePath)
                ->setSequence($order)
                ->setProduct($product);

            $this->em->persist($productImage);
        }

        $additionalProductAttributes = array_merge($additionalProductAttributes, $categoryAttributes);

        foreach ($additionalProductAttributes as $key => $attribute) {
            $productAttribute = (new ProductAttribute())
                ->setAttributeKey($key)
                ->setValue($attribute)
                ->setProduct($product);

            $this->em->persist($productAttribute);
        }

        $this->em->flush();
        $this->em->refresh($product);

        return $product;
    }

    public function updateProduct(Product $product, EditProductDto $dto, ?array $categoryAttributes = null): Product
    {
        if ($categoryAttributes) {
            foreach ($categoryAttributes as $key => $value) {
                $productAttribute = $this->productAttributeRepository->findOneBy(['attributeKey' => $key, 'product' => $product])
                    ->setAttributeKey($key)
                    ->setValue($value);
                $this->em->persist($productAttribute);
            }
        }

        $this->entityMapper->mapDtoToEntity($dto, $product);

        $this->em->persist($product);
        $this->em->flush();

        return $product;
    }

    public function registerView(Product $product): void
    {
        $user = $this->security->getUser();

        if ($user) {
            $viewedProduct = $this->viewedProductRepository->findOneBy(['product' => $product, 'user' => $user]);

            if (!$viewedProduct) {
                $viewedProduct = (new ViewedProduct())
                ->setProduct($product)
                ->setUser($user)
                ->setViewedAt(new \DateTimeImmutable());

                $this->em->persist($viewedProduct);

                $product->setViewsCount($product->getViewsCount() + 1);

                $this->em->flush();
            }
        }
    }
}
