<?php

declare(strict_types=1);

namespace App\Controller;

use App\Entity\Category;
use App\Repository\CategoryAttributeRepository;
use App\Repository\CategoryRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

class CategoryController extends AbstractController
{
    public function __construct(private readonly CategoryRepository $categoryRepository, private readonly CategoryAttributeRepository $categoryAttributeRepository)
    {
    }

    #[Route('/api/categories', name: 'get_categories', methods: ['GET'])]
    public function categoryList(): JsonResponse
    {
        $categories = $this->categoryRepository->findCategoryTree();

        return $this->json($categories);
    }

    #[Route('/api/categories-with-fields', name: 'get_category_with_fields', methods: ['GET'])]
    public function getCategoriesWithFields(): JsonResponse
    {
        $categories = $this->categoryRepository->findCategoriesWithFields();

        return $this->json($categories);
    }

    #[Route('/api/category/{id}', name: 'get_category_attributes', methods: ['GET'])]
    public function getCategoryAttributes(Category $category): JsonResponse
    {
        $attributes = $this->categoryAttributeRepository->findBy(['category' => $category]);

        return $this->json($attributes);
    }
}
