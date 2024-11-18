<?php

declare(strict_types=1);

namespace App\Controller;

use App\Dto\User\EditUserDto;
use App\Exception\ValidationException;
use App\Repository\UserRepository;
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
    private UserRepository $userRepository;
    private EntityManagerInterface $entityManager;
    private UserService $userService;

    public function __construct(SerializerInterface $serializer, ValidatorInterface $validator, UserRepository $userRepository, EntityManagerInterface $entityManager, UserService $userService)
    {
        $this->serializer = $serializer;
        $this->validator = $validator;
        $this->userRepository = $userRepository;
        $this->entityManager = $entityManager;
        $this->userService = $userService;
    }

    #[Route('/api/profile', name: 'api_profile', methods: ['GET'])]
    public function profile(): JsonResponse
    {
        $user = $this->getUser();

        if (!$user) {
            return $this->json(['error' => 'Unauthorized'], Response::HTTP_UNAUTHORIZED);
        }

        return $this->json([
            'id' => $user->getId(),
            'email' => $user->getEmail(),
            'name' => $user->getName(),
            'gender' => $user->getGender(),
            'discount' => $user->getDiscount(),
            'phone' => $user->getPhone(),
            'isSeller' => $user->isSeller(),
            'address' => $user->getAddress(),
        ]);
    }

    #[Route('/api/user/profile', name: 'edit_user_profile', methods: ['PATCH'])]
    public function editUserProfile(Request $request)
    {
        $user = $this->getUser();

        $dto = $this->serializer->deserialize($request->getContent(), EditUserDto::class, 'json');
        $errors = $this->validator->validate($dto);

        if (count($errors) > 0) {
            throw new ValidationException($errors);
        }

        $this->userService->updateUser($dto);

        $this->entityManager->flush();

        return $this->json(['message' => 'Профиль успешно обновлен'], 200);
    }
}
