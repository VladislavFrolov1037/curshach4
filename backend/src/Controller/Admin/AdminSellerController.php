<?php

declare(strict_types=1);

namespace App\Controller\Admin;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class AdminSellerController extends AbstractController
{
    #[Route('/admin-seller')]
    public function index(): Response
    {
        return $this->render('admin_seller/index.html.twig');
    }
}