<?php

namespace App\Services;

use App\Dto\User\EditUserDto;
use App\Dto\User\RegisterUserDto;
use App\Entity\User;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Security\Core\User\UserInterface;

class UserService
{
    private UserPasswordHasherInterface $passwordHasher;
    private Security $security;

    public function __construct(UserPasswordHasherInterface $passwordHasher, Security $security)
    {
        $this->passwordHasher = $passwordHasher;
        $this->security = $security;
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

    public function updateUser(EditUserDto $dto): ?UserInterface
    {
        $user = $this->security->getUser();

        if ($dto->getEmail() !== null) {
            $user->setEmail($dto->getEmail());
        }

        if ($dto->getName() !== null) {
            $user->setName($dto->getName());
        }

        if ($dto->getGender() !== null) {
            $user->setGender($dto->getGender());
        }

        if ($dto->getPhone() !== null) {
            $user->setPhone($dto->getPhone());
        }

        if ($dto->getAddress() !== null) {
            $user->setAddress($dto->getAddress());
        }

        return $user;
    }
}