<?php

namespace App\Entity;

use App\Repository\ViewedProductRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: ViewedProductRepository::class)]
class ViewedProduct
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column]
    private ?\DateTimeImmutable $viewed_at = null;

    #[ORM\ManyToOne(inversedBy: 'viewedProducts')]
    private ?User $user = null;

    #[ORM\ManyToOne(inversedBy: 'viewedProducts')]
    private ?Product $product = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getViewedAt(): ?\DateTimeImmutable
    {
        return $this->viewed_at;
    }

    public function setViewedAt(\DateTimeImmutable $viewed_at): static
    {
        $this->viewed_at = $viewed_at;

        return $this;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): static
    {
        $this->user = $user;

        return $this;
    }

    public function getProduct(): ?Product
    {
        return $this->product;
    }

    public function setProduct(?Product $product): static
    {
        $this->product = $product;

        return $this;
    }
}
