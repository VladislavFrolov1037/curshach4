<?php

declare(strict_types=1);

namespace App\Controller;

use App\Dto\Seller\RegisterSellerDto;
use App\Exception\ValidationException;
use App\Services\SellerService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Validator\ConstraintViolationListInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;

class SellerController extends AbstractController
{
    private ValidatorInterface $validator;
    private SerializerInterface $serializer;
    private SellerService $sellerService;

    public function __construct(ValidatorInterface $validator, SerializerInterface $serializer, SellerService $sellerService)
    {
        $this->validator = $validator;
        $this->serializer = $serializer;
        $this->sellerService = $sellerService;
    }

    #[Route('/seller')]
    public function index(): Response
    {
    }

    #[Route('/api/seller/become', name: 'become_seller', methods: ['POST'])]
    public function becomeSeller(Request $request): JsonResponse
    {
        $data = $request->getContent();
        $dto = $this->serializer->deserialize($data, RegisterSellerDto::class, 'json');

        $errors = $this->validator->validate($dto);

        if (count($errors) > 0) {
            throw new ValidationException($errors);
        }

//        if ($this->getUser()->getSeller()) {
//            return $this->json(['error' => 'Вы уже зарегистрированы как продавец.'], Response::HTTP_CONFLICT);
//        }

        $seller = $this->sellerService->createSeller($dto, $this->getUser());

        return $this->json($seller, Response::HTTP_CREATED);
    }
}
