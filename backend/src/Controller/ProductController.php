<?php

declare(strict_types=1);

namespace App\Controller;

use App\Dto\Product\EditProductDto;
use App\Entity\Category;
use App\Entity\Product;
use App\Entity\ProductQuestion;
use App\Enum\ProductStatus;
use App\Exception\ValidationException;
use App\Repository\OrderRepository;
use App\Repository\ProductRepository;
use App\Repository\ViewedProductRepository;
use App\Services\ProductService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;
use Symfony\Component\Serializer\Serializer;
use Symfony\Component\Validator\Validator\ValidatorInterface;

class ProductController extends AbstractController
{
    public function __construct(private ProductService $productService, private ProductRepository $productRepository, private ValidatorInterface $validator, private EntityManagerInterface $em, private readonly ViewedProductRepository $viewedProductRepository, private readonly OrderRepository $orderRepository)
    {
    }

    #[Route('/api/products/create', name: 'create_product', methods: ['POST'])]
    public function createProduct(Request $request): JsonResponse
    {
        $data = $request->request->all();

        $data['images'] = $request->files->get('images');

        $product = $this->productService->createProduct($data);

        return $this->json($product, 201, [], ['detailed' => true]);
    }

    #[Route('/api/products', name: 'list_products', methods: ['GET'])]
    public function list(): JsonResponse
    {
        $products = $this->productRepository->getProductsForFeed();

        return $this->json($products);
    }

    #[Route('/api/purchase-products', methods: ['GET'])]
    public function getPurchasedUserProducts(): JsonResponse
    {
        $products = $this->productRepository->findPurchasedUserProducts($this->getUser());

        return $this->json($products);
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
        $product->setStatus(ProductStatus::STATUS_REMOVED);
        $this->em->flush();

        return $this->json([], 204);
    }

    #[Route('/api/product/change/{id}', name: 'change_status_product', methods: ['POST'])]
    public function changeProductStatus(Product $product): JsonResponse
    {
        if (ProductStatus::STATUS_AVAILABLE === $product->getStatus()) {
            $product->setStatus(ProductStatus::STATUS_DISCONTINUED);
        } elseif (ProductStatus::STATUS_DISCONTINUED === $product->getStatus()) {
            $product->setStatus(ProductStatus::STATUS_AVAILABLE);
        }

        $this->em->flush();

        return $this->json($product, 200, [], ['detailed' => true]);
    }

    #[Route('/api/my-products', name: 'my-products', methods: ['GET'])]
    public function getMyProducts(): JsonResponse
    {
        $products = $this->productRepository->findBy(['seller' => $this->getUser()->getSeller()]);

        return $this->json($products);
    }

    #[Route('/api/product/view/{id}', name: 'view_product', methods: ['POST'])]
    public function addView(Product $product): JsonResponse
    {
        $this->productService->registerView($product);

        return $this->json([
            'viewsCount' => $product->getViewsCount(),
        ]);
    }

    #[Route('/api/products/category/{id}', name: 'get_products_by_category', methods: ['GET'])]
    public function getProductsByCategory(Category $category): JsonResponse
    {
        $products = $this->productRepository->findBy(['category' => $category]);

        return $this->json($products);
    }

    #[Route('/api/viewed', name: 'get_viewed', methods: ['GET'])]
    public function getViewedProducts(): JsonResponse
    {
        $user = $this->getUser();

        $viewedProducts = $this->viewedProductRepository->findBy(['user' => $user]);

        return $this->json($viewedProducts);
    }


    #[Route('/api/product/question', name: 'create_question', methods: ['POST'])]
    public function createProductQuestion(Request $request, EntityManagerInterface $em, ProductRepository $productRepository): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $productId = $data['product_id'] ?? null;
        $questionText = $data['question'] ?? null;

        if (!$productId || !$questionText) {
            return $this->json(['error' => 'Необходимо указать product_id и question'], 400);
        }

        $product = $productRepository->find($productId);

        if (!$product) {
            return $this->json(['error' => 'Товар не найден'], 404);
        }

        $user = $this->getUser();

        $productQuestion = new ProductQuestion();
        $productQuestion->setProduct($product);
        $productQuestion->setUser($user);
        $productQuestion->setQuestion($questionText);

        $em->persist($productQuestion);
        $em->flush();

        return $this->json([
            'id' => $productQuestion->getId(),
            'question' => $productQuestion->getQuestion(),
            'createdAt' => $productQuestion->getCreatedAt()->format('Y-m-d H:i:s'),
            'user' => [
                'id' => $user->getId(),
                'name' => $user->getName(),
            ]
        ]);
    }

    #[Route('/api/product/question/{id}/answer', name: 'answer_question', methods: ['POST'])]
    public function answerProductQuestion(ProductQuestion $productQuestion, Request $request, EntityManagerInterface $em, Security $security): JsonResponse
    {
        $user = $security->getUser();
        if (!$user || !$user->isAdmin()) {
            return $this->json(['error' => 'Доступ запрещен'], 403);
        }

        $data = json_decode($request->getContent(), true);
        $answer = $data['answer'] ?? null;

        if (!$answer) {
            return $this->json(['error' => 'Ответ не может быть пустым'], 400);
        }

        $productQuestion->setAnswer($answer);
        $productQuestion->setAnswerAt(new \DateTimeImmutable());
        $em->flush();

        return $this->json([
            'id' => $productQuestion->getId(),
            'answer' => $productQuestion->getAnswer(),
            'answerAt' => $productQuestion->getAnswerAt()->format('Y-m-d H:i:s'),
        ]);
    }
}
