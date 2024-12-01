<?php

declare(strict_types=1);

namespace App\Controller;

use App\Dto\Product\EditProductDto;
use App\Entity\Product;
use App\Enum\ProductStatus;
use App\Exception\ValidationException;
use App\Repository\ProductRepository;
use App\Services\ProductService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;
use Symfony\Component\Serializer\Serializer;
use Symfony\Component\Validator\Validator\ValidatorInterface;

class ProductController extends AbstractController
{
    public function __construct(private ProductService $productService, private ProductRepository $productRepository, private ValidatorInterface $validator, private EntityManagerInterface $em)
    {
    }

    #[Route('/api/products/create', name: 'create_product', methods: ['POST'])]
    public function createProduct(Request $request): JsonResponse
    {
        $data = $request->request->all();
        $data['image'] = $request->files->get('image');

        $product = $this->productService->createProduct($data);

        return $this->json($product, 201, [], ['detailed' => true]);
    }

    #[Route('/api/products', name: 'list_products', methods: ['GET'])]
    public function list(): JsonResponse
    {
        $product = $this->productRepository->findAll();

        return $this->json($product);
    }

    #[Route('api/product/{id}', name: 'get_product', methods: ['GET'])]
    public function product(Product $product): JsonResponse
    {
        return $this->json($product, 200, [], ['detailed' => true]);
    }

    #[Route('/api/product/{id}', name: 'edit_product', methods: ['PATCH'])]
    public function edit(Request $request, Product $product): JsonResponse
    {
        if (!$product->isOwnedBy($this->getUser())) {
            throw new AccessDeniedHttpException('Вам не разрешается редактировать этот продукт');
        }

        $data = $request->request->all();

        $serializer = new Serializer([new ObjectNormalizer()]);

        $dto = $serializer->denormalize($data, EditProductDto::class);
        $dto->image = $request->files->get('image') ?: null;

        $errors = $this->validator->validate($dto);

        if (count($errors) > 0) {
            throw new ValidationException($errors);
        }

        $this->productService->updateProduct($product, $dto, $data['categoryAttributes'] ?? null);

        return $this->json($product, 200, [], ['detailed' => true]);
    }

    #[Route('/api/product/{id}', name: 'delete_product', methods: ['DELETE'])]
    public function deleteProduct(Product $product): JsonResponse
    {
        $this->em->remove($product);
        $this->em->flush();

        return $this->json([], 204);
    }

    #[Route('/api/product/change/{id}', name: 'change_status_product', methods: ['POST'])]
    public function changeProductStatus(Product $product): JsonResponse
    {
        $product->setStatus(ProductStatus::STATUS_DISCONTINUED);

        $this->em->persist($product);
        $this->em->flush();

        return $this->json($product, 200, [], ['detailed' => true]);
    }

    #[Route('/api/my-products', name: 'my-products', methods: ['GET'])]
    public function getMyProducts(): JsonResponse
    {
        $products = $this->productRepository->findBy(['seller' => $this->getUser()->getSeller()]);

        return $this->json($products);
    }
}