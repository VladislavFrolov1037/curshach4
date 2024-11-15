<?php

declare(strict_types=1);

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class UserController extends AbstractController
{
    #[Route('/api/profile', name: 'api_profile', methods: ['GET'])]
    public function profile(): JsonResponse
    {
        $user = $this->getUser();

        if (!$user) {
            return $this->json(['error' => 'Unauthorized'], Response::HTTP_UNAUTHORIZED);
        }

        return $this->json([
            'id' => $user->getId(),
            'name' => $user->getName(),
            'gender' => $user->getGender(),
            'email' => $user->getEmail(),
            'card' => $user->getCard(),
            'phone' => $user->getPhone(),
            'discount' => $user->getDiscount(),
        ]);
    }
}
