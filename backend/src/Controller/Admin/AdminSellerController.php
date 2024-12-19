<?php

declare(strict_types=1);

namespace App\Controller\Admin;

use App\Enum\SellerStatus;
use App\Repository\SellerRepository;
use App\Entity\Seller;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class AdminSellerController extends AbstractController
{
    public function __construct(private readonly SellerRepository $sellerRepository)
    {
    }

    #[Route('/api/admin-seller', name: 'admin_seller_index', methods: ['GET'])]
    public function index(): Response
    {
        $sellers = $this->sellerRepository->findAll();

        return $this->json($sellers);
    }

    #[Route('/api/admin-seller/{id}/update-status', name: 'admin_seller_update_status', methods: ['POST'])]
    public function updateStatus(int $id, Request $request): Response
    {
        $seller = $this->sellerRepository->find($id);

        if (!$seller) {
            return $this->json(['error' => 'Seller not found'], Response::HTTP_NOT_FOUND);
        }

        $status = $request->get('status');

        if (!SellerStatus::tryFrom($status)) {
            return $this->json(['error' => 'Invalid status'], Response::HTTP_BAD_REQUEST);
        }

        $seller->setStatus(SellerStatus::from($status));

        $this->sellerRepository->save($seller);

        return $this->json(['success' => 'Status updated'], Response::HTTP_OK);
    }
}
