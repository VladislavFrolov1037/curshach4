<?php

namespace App\Entity;

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

    #[ORM\ManyToOne(targetEntity: Category::class)]
    #[ORM\JoinColumn(name: 'parent_category_id', referencedColumnName: 'id', nullable: true)]
    private ?Category $parentCategory = null;

    #[ORM\OneToMany(mappedBy: 'category', targetEntity: Product::class)]
    private $products;

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

    /**
     * @return mixed
     */
    public function getProducts(): mixed
    {
        return $this->products;
    }

    /**
     * @param mixed $products
     */
    public function setProducts($products): static
    {
        $this->products = $products;

        return $this;
    }
}
