<?php

namespace App\Serializer\Normalizer;

use App\Entity\User;
use Symfony\Component\Serializer\Normalizer\NormalizerInterface;

class UserNormalizer implements NormalizerInterface
{
    public function supportsNormalization($data, ?string $format = null, array $context = []): bool
    {
        return $data instanceof User;
    }

    public function normalize($object, ?string $format = null, array $context = []): array
    {
        if ($context['shortly'] ?? false) {
            return [
                'id' => $object->getId(),
                'name' => $object->getName(),
            ];
        }

        if ($context['from-tg'] ?? false) {
            return [
                'id' => $object->getId(),
                'orderNotification' => $object->isOrderNotification(),
                'marketplaceNotification' => $object->isMarketplaceNotification(),
                'promoNotification' => $object->isPromoNotification(),
            ];
        }

        return [
            'id' => $object->getId(),
            'name' => $object->getName(),
            'email' => $object->getEmail(),
            'gender' => $object->getGender(),
            'phone' => $object->getPhone(),
            'createdAt' => $object->getCreatedAt()->format('d.m.Y H:i:s'),
            'isSeller' => $object->isSeller(),
            'isAdmin' => $object->isAdmin(),
            'telegramId' => $object->getTelegramId(),
        ];
    }

    public function getSupportedTypes(?string $format): array
    {
        return [
            User::class => true,
        ];
    }
}
