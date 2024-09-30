<?php

declare(strict_types=1);

namespace App\Controller\User;

use App\Entity\User;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class AuthController extends AbstractController
{
    #[Route('/api/register', name: 'api_register', methods: ['POST'])]
    public function register(Request $request)
    {
        $data = json_decode($request->getContent(), true);
        $user = (new User())
            ->setEmail($data['email'])
            ->setPassword($data['password'])
            ->setRoles(['ROLE_USER'])
            ->setCard($data['card'])
            ->setGender($data['gender'])
            ->setPhone($data['phone'])
            ->setName($data['name']);


    }
}
