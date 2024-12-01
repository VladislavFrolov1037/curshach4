<?php

namespace App\Services;

use App\Dto\Product\CreateProductDto;
use App\Dto\Product\EditProductDto;
use App\Entity\Product;
use App\Entity\ProductAttribute;
use App\Enum\ProductStatus;
use App\Exception\ValidationException;
use App\Repository\CategoryAttributeRepository;
use App\Repository\CategoryRepository;
use App\Repository\ProductAttributeRepository;
use App\Utils\EntityMapper;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Validator\ConstraintViolation;
use Symfony\Component\Validator\Validator\ValidatorInterface;

class ProductService
{
    public function __construct(
        private EntityManagerInterface      $em,
        private ValidatorInterface          $validator,
        private FileService                 $fileService,
        private Security                    $security,
        private CategoryAttributeRepository $categoryAttributeRepository,
        private CategoryRepository          $categoryRepository,
        private readonly EntityMapper       $entityMapper, private readonly ProductAttributeRepository $productAttributeRepository,
    )
    {
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
        $dto->image = $data['image'] ?? null;
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
        }

        if (count($errors) > 0) {
            throw new ValidationException($errors);
        }

        $product = (new Product())
            ->setName($dto->name)
            ->setDescription($dto->description)
            ->setPrice($dto->price)
            ->setQuantity($dto->quantity)
            ->setImage($this->fileService->upload($dto->image))
            ->setSeller($this->security->getUser()->getSeller())
            ->setCategory($this->categoryRepository->find($dto->categoryId))
            ->setStatus(ProductStatus::STATUS_AVAILABLE);

        $this->em->persist($product);

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
}
