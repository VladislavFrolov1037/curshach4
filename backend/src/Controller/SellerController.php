<?php

declare(strict_types=1);

namespace App\Controller;

use App\Dto\Seller\RegisterSellerDto;
use App\Exception\ValidationException;
use App\Repository\SellerRepository;
use App\Services\FileService;
use App\Services\SellerService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;

class SellerController extends AbstractController
{
    private ValidatorInterface $validator;
    private SerializerInterface $serializer;
    private SellerService $sellerService;
    private SellerRepository $sellerRepository;
    private FileService $fileService;

    public function __construct(ValidatorInterface $validator, SerializerInterface $serializer, SellerService $sellerService, SellerRepository $sellerRepository, FileService $fileService)
    {
        $this->validator = $validator;
        $this->serializer = $serializer;
        $this->sellerService = $sellerService;
        $this->sellerRepository = $sellerRepository;
        $this->fileService = $fileService;
    }

    #[Route('/api/seller/profile')]
    public function profile(): Response
    {
        $seller = $this->getUser()->getSeller();

        return $this->json($seller);
    }

    #[Route('/api/seller/become', name: 'become_seller', methods: ['POST'])]
    public function becomeSeller(Request $request): JsonResponse
    {
        $user = $this->getUser();

        if ($user->isSeller()) {
            return $this->json(['error' => 'Вы уже зарегистрированы как продавец.'], Response::HTTP_CONFLICT);
        }

        $dto = new RegisterSellerDto();
        $dto->email = $request->request->get('email');
        $dto->name = $request->request->get('name');
        $dto->description = $request->request->get('description');
        $dto->type = $request->request->get('type');
        $dto->phone = $request->request->get('phone');
        $dto->taxId = $request->request->get('tax_id');

        if ($request->request->get('passport')) {
            $dto->passport = $request->request->get('passport');
        }

        $dto->address = $request->request->get('address');
        $dto->image = $request->files->get('image');

        $errors = $this->validator->validate($dto);
        if (count($errors) > 0) {
            throw new ValidationException($errors);
        }

        $seller = $this->sellerService->createSeller($dto, $user);

        return $this->json($seller, Response::HTTP_CREATED);
    }
}
