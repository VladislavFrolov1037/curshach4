<?php

declare(strict_types=1);

namespace App\Controller\Auth;

use App\Dto\User\RegisterUserDto;
use App\Repository\UserRepository;
use App\Services\UserService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Validator\Validator\ValidatorInterface;

class AuthController extends AbstractController
{
    private EntityManagerInterface $entityManager;
    private UserService $userService;
    private ValidatorInterface $validator;
    private UserRepository $userRepository;

    public function __construct(EntityManagerInterface $entityManager, UserService $userService, ValidatorInterface $validator, UserRepository $userRepository)
    {
        $this->entityManager = $entityManager;
        $this->userService = $userService;
        $this->validator = $validator;
        $this->userRepository = $userRepository;
    }

    #[Route('/api/register', name: 'api_register', methods: ['POST'])]
    public function register(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $dto = new RegisterUserDTO($this->userRepository);
        $dto->populate($data);

        $errors = $this->validator->validate($dto);

        if (count($errors) > 0) {
            $errorMessages = [];

            foreach ($errors as $error) {
                $errorMessages[$error->getPropertyPath()] = $error->getMessage();
            }

            return $this->json(['errors' => $errorMessages], 400);
        }

        $user = $this->userService->registerUser($dto);

        $this->entityManager->persist($user);
        $this->entityManager->flush();

        return $this->json(['message' => 'Регистрация прошла успешно'], 201);
    }

    #[Route('/api/login', name: 'api_login', methods: ['POST'])]
    public function login(): JsonResponse
    {
    }
}
