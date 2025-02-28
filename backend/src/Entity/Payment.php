<?php

namespace App\Entity;

use App\Repository\PaymentRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: PaymentRepository::class)]
class Payment
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(type: Types::TEXT)]
    private ?string $auth_code = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getAuthCode(): ?string
    {
        return $this->auth_code;
    }

    public function setAuthCode(string $auth_code): static
    {
        $this->auth_code = $auth_code;

        return $this;
    }
}
