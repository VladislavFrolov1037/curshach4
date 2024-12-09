<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
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

    #[ORM\Column(type: 'string', length: 255, nullable: true)]
    private ?string $value = null;

    #[ORM\ManyToOne(targetEntity: Category::class, inversedBy: 'categoryAttribute')]
    private ?Category $category = null;

    /**
     * @var Collection<int, ValidValue>
     */
    #[ORM\OneToMany(targetEntity: ValidValue::class, mappedBy: 'categoryAttribute')]
    private Collection $validValues;

    public function __construct()
    {
        $this->validValues = new ArrayCollection();
    }

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

    public function getValue(): ?string
    {
        return $this->value;
    }

    public function setValue(?string $value): static
    {
        $this->value = $value;

        return $this;
    }

    /**
     * @return Collection<int, ValidValue>
     */
    public function getValidValues(): Collection
    {
        return $this->validValues;
    }

    public function addValidValue(ValidValue $validValue): static
    {
        if (!$this->validValues->contains($validValue)) {
            $this->validValues->add($validValue);
            $validValue->setCategoryAttribute($this);
        }

        return $this;
    }

    public function removeValidValue(ValidValue $validValue): static
    {
        if ($this->validValues->removeElement($validValue)) {
            // set the owning side to null (unless already changed)
            if ($validValue->getCategoryAttribute() === $this) {
                $validValue->setCategoryAttribute(null);
            }
        }

        return $this;
    }
}
