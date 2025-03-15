<?php

namespace App\Services;

use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Security\Core\User\UserInterface;

class TelegramBotService
{
    public function __construct(private readonly EntityManagerInterface $em)
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
}
