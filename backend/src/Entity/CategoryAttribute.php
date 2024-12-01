<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity]
class CategoryAttribute
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $attribute_key = null;

    #[ORM\Column(type: 'boolean')]
    private ?bool $isRequired = null;

    #[ORM\ManyToOne(targetEntity: Category::class, inversedBy: 'attributes')]
    private ?Category $category = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getAttributeKey(): ?string
    {
        return $this->attribute_key;
    }

    public function setAttributeKey(string $attribute_key): static
    {
        $this->attribute_key = $attribute_key;
        return $this;
    }

    public function isRequired(): ?bool
    {
        return $this->isRequired;
    }

    public function setIsRequired(bool $isRequired): static
    {
        $this->isRequired = $isRequired;
        return $this;
    }

    public function getCategory(): ?Category
    {
        return $this->category;
    }

    public function setCategory(?Category $category): static
    {
        $this->category = $category;
        return $this;
    }
}
