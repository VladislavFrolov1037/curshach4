<?php

declare(strict_types=1);

namespace App\Controller;

use App\Repository\PromoCodeRepository;
use App\Repository\UserRepository;
use App\Services\TelegramBotService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class TelegramBotController extends AbstractController
{
    public function __construct(private readonly TelegramBotService $telegramBotService, private readonly UserRepository $userRepository, private readonly EntityManagerInterface $em, private readonly PromoCodeRepository $promoCodeRepository)
    {
    }

    #[Route('/api/tg/update', name: 'update-tg-id', methods: ['POST'])]
    public function updateTgId(Request $request): Response
    {
        $user = $this->userRepository->find((int) $request->get('id'));
        $tgID = $request->get('tg_id');

        if ($this->userRepository->findOneBy(['telegramId' => $tgID])) {
            return $this->json(['message' => 'К этому телеграм аккаунту уже привязан аккаунт маркетплейса'], 400);
        }

        $user = $this->telegramBotService->setTelegramId($user, $tgID);

        return $this->json($user);
    }

    #[Route('/api/tg/check/{tgID}', name: 'check-tg-id', methods: ['GET'])]
    public function checkUserInDatabase($tgID): Response
    {
        $user = $this->userRepository->findOneBy(['telegramId' => $tgID]);

        return $user ? $this->json($user, 200, [], ['from-tg' => true]) : $this->json([], 404);
    }

    #[Route('/api/tg/notification/update', name: 'notification-update', methods: ['POST'])]
    public function updateNotification(Request $request): Response
    {
        $user = $this->userRepository->findOneBy(['telegramId' => $request->get('tg_id')]);
        $action = 'enable' === $request->get('action');

        switch ($request->get('notification_type')) {
            case 'order_delivery':
                $user->setOrderNotification($action);
                break;
            case 'marketplace_notifications':
                $user->setMarketplaceNotification($action);
                break;
            case 'promo_notifications':
                $user->setPromoNotification($action);
                break;
        }

        $this->em->persist($user);
        $this->em->flush();

        return $this->json($user, 200, [], ['from-tg' => true]);
    }

    #[Route('/api/admin/tg/create-promo', name: 'create-promo', methods: ['POST'])]
    public function createPromo(Request $request): JsonResponse
    {
        $promoCode = $this->telegramBotService->createPromo(json_decode($request->getContent()));

        return $this->json($promoCode);
    }

    #[Route('/api/admin/tg/promo', name: 'get-promo', methods: ['GET'])]
    public function getPromoCodes(): JsonResponse
    {
        $promoCodes = $this->promoCodeRepository->findAll();

        return $this->json($promoCodes);
    }
}
