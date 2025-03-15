<?php

declare(strict_types=1);

namespace App\Controller;

use App\Dto\User\EditUserDto;
use App\Entity\User;
use App\Exception\ValidationException;
use App\Repository\ProductRepository;
use App\Services\UserService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;

class UserController extends AbstractController
{
    private SerializerInterface $serializer;
    private ValidatorInterface $validator;
    private EntityManagerInterface $entityManager;
    private UserService $userService;
    private ProductRepository $productRepository;

    public function __construct(SerializerInterface $serializer, ValidatorInterface $validator, EntityManagerInterface $entityManager, UserService $userService, ProductRepository $productRepository)
    {
        $this->serializer = $serializer;
        $this->validator = $validator;
        $this->entityManager = $entityManager;
        $this->userService = $userService;
        $this->productRepository = $productRepository;
    }

    #[Route('/api/profile', name: 'api_profile', methods: ['GET'])]
    public function profile(): JsonResponse
    {
        $user = $this->getUser();

        if (!$user) {
            return $this->json(['error' => 'Unauthorized'], Response::HTTP_UNAUTHORIZED);
        }

        return $this->json($user);
    }

    #[Route('/api/user/profile', name: 'edit_user_profile', methods: ['PATCH'])]
    public function editUserProfile(Request $request): JsonResponse
    {
        $dto = $this->serializer->deserialize($request->getContent(), EditUserDto::class, 'json');
        $errors = $this->validator->validate($dto);

        if (count($errors) > 0) {
            throw new ValidationException($errors);
        }

        $user = $this->userService->updateUser($dto);

        $this->entityManager->flush();

        return $this->json($user);
    }

    #[Route('/api/user/{id}', name: 'get_user_data', methods: ['GET'])]
    public function getUserData(User $user): JsonResponse
    {
        return $this->json(['customer' => $user, 'reviews' => $user->getFeedback(), 'products' => $this->productRepository->findPurchasedUserProducts($user)], 200, ['shortly' => true]);
    }
}
