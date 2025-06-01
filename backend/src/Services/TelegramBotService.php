<?php

namespace App\Services;

use App\Entity\Order;
use App\Entity\PromoCode;
use App\Enum\OrderStatus;
use App\Repository\CategoryRepository;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Notifier\Bridge\Telegram\TelegramOptions;
use Symfony\Component\Notifier\ChatterInterface;
use Symfony\Component\Notifier\Message\ChatMessage;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Contracts\Translation\TranslatorInterface;

class TelegramBotService
{
    public function __construct(private readonly EntityManagerInterface $em, private readonly ChatterInterface $chatter, private readonly UserRepository $userRepository, private readonly CategoryRepository $categoryRepository, private readonly TranslatorInterface $translator)
    {
    }

    public function setTelegramId(UserInterface $user, string $id): UserInterface
    {
        $user->setTelegramId($id);
        $user->setOrderNotification(true);
        $user->setMarketplaceNotification(true);
        $user->setPromoNotification(true);

        $this->em->persist($user);
        $this->em->flush();

        return $user;
    }

    public function createPromo($data): PromoCode
    {
        $promoCode = (new PromoCode())
            ->setCode($this->generatePromoCode())
            ->setDiscount($data->discount)
            ->setMaxUses($data->maxUses)
            ->setUsedCount(0)
            ->setExpiresAt(new \DateTimeImmutable($data->expiresAt))
            ->setCreatedAt(new \DateTimeImmutable());

        $this->em->persist($promoCode);
        $this->em->flush();

        $this->sendPromo($promoCode);

        return $promoCode;
    }

    public function generatePromoCode(): string
    {
        $characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        $promoCode = '';

        for ($i = 0; $i < 16; ++$i) {
            $promoCode .= $characters[random_int(0, strlen($characters) - 1)];
        }

        return $promoCode;
    }

    public function sendPromo($promoCode): void
    {
        $chatMessage = new ChatMessage(
            "🎉 Новый промокод: *{$promoCode->getCode()}* 🎉\n\n" .
            "💰 Скидка: *{$promoCode->getDiscount()}%*\n" .
            "🔄 Количество активаций: *{$promoCode->getMaxUses()}*\n" .
            "📅 Действует до: *{$promoCode->getExpiresAt()->format('d.m.Y')}*\n" .
            'Используйте промокод при оформлении заказа и получайте скидку! ✅'
        );

        $users = $this->userRepository->findBy(['promoNotification' => true]);

        foreach ($users as $user) {
            $this->sendMessage($chatMessage, $user->getTelegramId());
        }
    }

    public function buildOrderMessage(Order $order, UserInterface $user): void
    {
        $orderUrl = 'http://127.0.0.1:3000/orders';

        $message = new ChatMessage(match ($order->getStatus()) {
            OrderStatus::STATUS_NEW => sprintf('Здравствуйте, %s! Ваш заказ на сумму %s руб, создан и находится в обработке. Подробнее: %s', $user->getName(),$order->getTotalPrice(),  $orderUrl),
            OrderStatus::STATUS_PAID => sprintf('Ваш заказ на сумму %s руб, оплачен. Спасибо за покупку, %s! Подробнее: %s', $user->getName(), $order->getTotalPrice(), $orderUrl),
            OrderStatus::STATUS_DELIVERED => sprintf('%s, ваш заказ на сумму %s руб, доставлен. Надеемся, вам понравится! Подробнее: %s', $user->getName(),  $order->getTotalPrice(),$orderUrl),
            default => sprintf('Статус вашего заказа на сумму %s руб, обновлён на %s. Подробнее: %s', $order->getTotalPrice(), $this->translator->trans($order->getStatus()), $orderUrl),
        });

        $this->sendMessage($message, $user->getTelegramId());
    }

    public function sendMessage($chatMessage, $tgID): void
    {
        if ($tgID) {
            $telegramOptions = (new TelegramOptions())->chatId($tgID);

            $chatMessage->options($telegramOptions);

            $this->chatter->send($chatMessage);
        }
    }
}
