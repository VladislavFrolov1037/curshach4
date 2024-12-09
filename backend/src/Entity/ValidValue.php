<?php

namespace App\Entity;

use App\Repository\ValidValueRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: ValidValueRepository::class)]
class ValidValue
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'validValues')]
    private ?CategoryAttribute $categoryAttribute = null;

    #[ORM\Column(length: 255)]
    private ?string $value = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getCategoryAttribute(): ?CategoryAttribute
    {
        return $this->categoryAttribute;
    }

    public function setCategoryAttribute(?CategoryAttribute $categoryAttribute): static
    {
        $this->categoryAttribute = $categoryAttribute;

        return $this;
    }

    public function getValue(): ?string
    {
        return $this->value;
    }

    public function setValue(string $value): static
    {
        $this->value = $value;

        return $this;
    }
}
