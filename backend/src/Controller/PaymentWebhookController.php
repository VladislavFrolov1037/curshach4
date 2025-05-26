<?php

namespace App\Controller;

use App\Entity\Payment;
use App\Enum\OrderStatus;
use App\Repository\OrderRepository;
use App\Repository\PaymentRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Contracts\HttpClient\HttpClientInterface;

class PaymentWebhookController extends AbstractController
{
    public function __construct(
        private readonly OrderRepository $orderRepository,
        private readonly EntityManagerInterface $em,
        private readonly HttpClientInterface $client,
        private readonly PaymentRepository $paymentRepository,
        private readonly string $secretKey,
        private readonly string $clientId,
        private readonly string $redirectUri,
    ) {
    }

    #[Route('/api/payment/webhook', name: 'payment_webhook', methods: ['POST'])]
    public function handleWebhook(Request $request): JsonResponse
    {
        $data = $request->request->all();
        $hashString = sprintf(
            '%s&%s&%s&%s&%s&%s&%s&%s&%s',
            $data['notification_type'] ?? '',
            $data['operation_id'] ?? '',
            $data['amount'] ?? '',
            $data['currency'] ?? '',
            $data['datetime'] ?? '',
            $data['sender'] ?? '',
            $data['codepro'] ?? '',
            $this->secretKey,
            $data['label'] ?? ''
        );
        $calculatedHash = sha1($hashString);

        if ($calculatedHash !== ($data['sha1_hash'] ?? '')) {
            return $this->json(['error' => 'Invalid hash'], 403);
        }

        $order = $this->orderRepository->find($data['label']);

        if ($order->getTransactionId()) {
            if ($order->getTransactionId() === $data['operation_id']) {
                return $this->json(['error' => 'Duplicate payment'], 400);
            }
        }

        $order->setStatus(OrderStatus::STATUS_PAID);
        $order->setTransactionId($data['operation_id']);
        $this->em->persist($order);
        $this->em->flush();

        return $this->json(['message' => 'Payment received']);
    }

    #[Route('/api/oAuth', name: 'oAuth', methods: ['GET'])]
    public function oAuthUMoney(Request $request): JsonResponse|RedirectResponse
    {
        $code = $request->query->get('code');

        if (!$code) {
            return $this->json(['error' => 'Code is missing'], 400);
        }

        try {
            $token = $this->getAccessToken($code);

            if (!$token) {
                return $this->json(['error' => 'Failed to retrieve access token'], 403);
            }

            $oAuth = $this->paymentRepository->findOneBy([]);

            if (!$oAuth) {
                $oAuth = new Payment();
            }

            $oAuth->setAuthCode($token);

            $this->em->persist($oAuth);
            $this->em->flush();

            return new RedirectResponse('http://localhost:3000/admin/tokens?success=1');
        } catch (\Exception $e) {
            return $this->json(['error' => $e->getMessage()], 500);
        }
    }

    private function getAccessToken(string $code): ?string
    {
        $response = $this->client->request('POST', 'https://yoomoney.ru/oauth/token', [
            'headers' => [
                'Content-Type' => 'application/x-www-form-urlencoded',
            ],
            'body' => http_build_query([
                'code' => $code,
                'client_id' => '8919BAD7A0D5603569CA20488C3A66CD561C5E32238BD4CC2A6EAC9D1845507D',
                'redirect_uri' => 'https://wc4k6w-109-195-214-136.ru.tuna.am/api/oAuth',
                'grant_type' => 'authorization_code',
            ]),
        ]);

        $data = json_decode($response->getContent(), true);

        return $data['access_token'] ?? null;
    }

    #[Route('/api/payment/seller')]
    public function paymentForSellers()
    {
    }
}
