<?php

namespace App\Services;

use App\Dto\User\RegisterUserDto;
use App\Entity\User;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class UserService
{
    private UserPasswordHasherInterface $passwordHasher;

    public function __construct(UserPasswordHasherInterface $passwordHasher)
    {
        $this->passwordHasher = $passwordHasher;
    }

    public function registerUser(RegisterUserDto $dto): JsonResponse|User
    {
        return (new User())
            ->setEmail($dto->email)
            ->setRoles(['ROLE_USER'])
            ->setPassword($this->passwordHasher->hashPassword(new User(), $dto->password))
            ->setName($dto->name)
            ->setGender($dto->gender ?? null)
            ->setPhone($dto->phone ?? null)
            ->setSeller(false);
    }
}