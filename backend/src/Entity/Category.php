<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity]
class Category
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $name = null;

    #[ORM\ManyToOne(targetEntity: Category::class, cascade: ['remove', 'persist'])]
    #[ORM\JoinColumn(name: 'parent_category_id', referencedColumnName: 'id', nullable: true, onDelete: 'CASCADE')]
    private ?Category $parentCategory = null;

    #[ORM\OneToMany(targetEntity: Product::class, mappedBy: 'category')]
    private $products;

    #[ORM\OneToMany(targetEntity: CategoryAttribute::class, mappedBy: 'category')]
    private ?Collection $categoryAttributes = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $icon = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): static
    {
        $this->name = $name;

        return $this;
    }

    public function getParentCategory(): ?Category
    {
        return $this->parentCategory;
    }

    public function setParentCategory(?Category $parentCategory): static
    {
        $this->parentCategory = $parentCategory;

        return $this;
    }

    public function getProducts(): mixed
    {
        return $this->products;
    }

    public function setProducts($products): static
    {
        $this->products = $products;

        return $this;
    }

    public function getCategoryAttributes(): ?Collection
    {
        return $this->categoryAttributes;
    }

    public function setCategoryAttributes(?Collection $categoryAttributes): static
    {
        $this->categoryAttributes = $categoryAttributes;

        return $this;
    }

    public function getIcon(): ?string
    {
        return $this->icon;
    }

    public function setIcon(?string $icon): static
    {
        $this->icon = $icon;

        return $this;
    }
}
