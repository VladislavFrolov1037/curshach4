<?php

namespace App\Security;

use Lexik\Bundle\JWTAuthenticationBundle\Event\AuthenticationSuccessEvent;
use Symfony\Component\Security\Core\User\UserInterface;

class AuthenticationSuccessHandler
{
    public function onAuthenticationSuccess(AuthenticationSuccessEvent $event): void
    {
        $data = $event->getData();
        $user = $event->getUser();

        if ($user instanceof UserInterface) {
            $data['user'] = [
                'id' => $user->getId(),
                'email' => $user->getEmail(),
                'name' => $user->getName(),
                // Дополнительные данные о пользователе
            ];
        }

        $event->setData($data);
    }
}
