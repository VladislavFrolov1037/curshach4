<?php

namespace App\Entity;

use App\Enum\ProductStatus;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Security\Core\User\UserInterface;

#[ORM\Entity]
class Product
{

    public function __construct()
    {
        $this->attributes = new ArrayCollection();
        $this->images = new ArrayCollection();
        $this->viewedProducts = new ArrayCollection();
        $this->cartItems = new ArrayCollection();
        $this->favorites = new ArrayCollection();
        $this->orderItems = new ArrayCollection();
        $this->feedbacks = new ArrayCollection();
        $this->productQuestions = new ArrayCollection();
    }

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $name = null;

    #[ORM\Column(length: 255)]
    private ?string $description = null;

    #[ORM\Column(type: 'decimal', precision: 10, scale: 2)]
    private ?string $price = null;

    #[ORM\Column]
    private ?int $quantity = null;

    #[ORM\ManyToOne(targetEntity: Category::class, inversedBy: 'products')]
    private ?Category $category = null;

    #[ORM\ManyToOne(targetEntity: Seller::class, inversedBy: 'products')]
    private Seller $seller;

    #[ORM\OneToMany(targetEntity: ProductAttribute::class, mappedBy: 'product', cascade: ['remove'])]
    private Collection $attributes;

    #[ORM\Column(length: 30)]
    private ?string $status = null;

    /**
     * @var Collection<int, Image>
     */
    #[ORM\OneToMany(targetEntity: Image::class, mappedBy: 'product', fetch: 'EAGER', cascade: ['persist', 'remove'])]
    private Collection $images;

    #[ORM\Column]
    private ?int $views_count = null;

    /**
     * @var Collection<int, ViewedProduct>
     */
    #[ORM\OneToMany(targetEntity: ViewedProduct::class, mappedBy: 'product')]
    private Collection $viewedProducts;

    /**
     * @var Collection<int, CartItem>
     */
    #[ORM\OneToMany(targetEntity: CartItem::class, mappedBy: 'product')]
    private Collection $cartItems;

    /**
     * @var Collection<int, Favorite>
     */
    #[ORM\OneToMany(targetEntity: Favorite::class, mappedBy: 'product')]
    private Collection $favorites;

    /**
     * @var Collection<int, OrderItem>
     */
    #[ORM\OneToMany(targetEntity: OrderItem::class, mappedBy: 'product')]
    private Collection $orderItems;

    /**
     * @var Collection<int, Feedback>
     */
    #[ORM\OneToMany(targetEntity: Feedback::class, mappedBy: 'product')]
    private Collection $feedbacks;

    /**
     * @var Collection<int, ProductQuestion>
     */
    #[ORM\OneToMany(targetEntity: ProductQuestion::class, mappedBy: 'product')]
    private Collection $productQuestions;

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

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(string $description): static
    {
        $this->description = $description;

        return $this;
    }

    public function getPrice(): ?string
    {
        return $this->price;
    }

    public function setPrice(string $price): static
    {
        $this->price = $price;

        return $this;
    }

    public function getQuantity(): ?int
    {
        return $this->quantity;
    }

    public function setQuantity(int $quantity): static
    {
        $this->quantity = $quantity;

        if ($this->quantity <= 0) {
            $this->status = ProductStatus::STATUS_OUT_OF_STOCK;
        }

        return $this;
    }

    public function getSeller(): Seller
    {
        return $this->seller;
    }

    public function setSeller(Seller $seller): static
    {
        $this->seller = $seller;

        return $this;
    }

    public function getAttributes(): ArrayCollection|Collection
    {
        return $this->attributes;
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

    public function isOwnedBy(UserInterface $user): bool
    {
        return $this->getSeller()->getId() === $user->getSeller()->getId();
    }

    public function getStatus(): ?string
    {
        return $this->status;
    }

    public function setStatus(string $status): static
    {
        $this->status = $status;

        return $this;
    }

    /**
     * @return Collection<int, Image>
     */
    public function getImages(): Collection
    {
        return $this->images;
    }

    public function addImage(Image $image): static
    {
        if (!$this->images->contains($image)) {
            $this->images->add($image);
            $image->setProduct($this);
        }

        return $this;
    }

    public function removeImage(Image $image): static
    {
        if ($this->images->removeElement($image)) {
            // set the owning side to null (unless already changed)
            if ($image->getProduct() === $this) {
                $image->setProduct(null);
            }
        }

        return $this;
    }

    public function getViewsCount(): ?int
    {
        return $this->views_count;
    }

    public function setViewsCount(int $views_count): static
    {
        $this->views_count = $views_count;

        return $this;
    }

    /**
     * @return Collection<int, ViewedProduct>
     */
    public function getViewedProducts(): Collection
    {
        return $this->viewedProducts;
    }

    public function addViewedProduct(ViewedProduct $viewedProduct): static
    {
        if (!$this->viewedProducts->contains($viewedProduct)) {
            $this->viewedProducts->add($viewedProduct);
            $viewedProduct->setProduct($this);
        }

        return $this;
    }

    public function removeViewedProduct(ViewedProduct $viewedProduct): static
    {
        if ($this->viewedProducts->removeElement($viewedProduct)) {
            // set the owning side to null (unless already changed)
            if ($viewedProduct->getProduct() === $this) {
                $viewedProduct->setProduct(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, CartItem>
     */
    public function getCartItems(): Collection
    {
        return $this->cartItems;
    }

    public function addCartItem(CartItem $cartItem): static
    {
        if (!$this->cartItems->contains($cartItem)) {
            $this->cartItems->add($cartItem);
            $cartItem->setProduct($this);
        }

        return $this;
    }

    public function removeCartItem(CartItem $cartItem): static
    {
        if ($this->cartItems->removeElement($cartItem)) {
            // set the owning side to null (unless already changed)
            if ($cartItem->getProduct() === $this) {
                $cartItem->setProduct(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Favorite>
     */
    public function getFavorites(): Collection
    {
        return $this->favorites;
    }

    public function addFavorite(Favorite $favorite): static
    {
        if (!$this->favorites->contains($favorite)) {
            $this->favorites->add($favorite);
            $favorite->setProduct($this);
        }

        return $this;
    }

    public function removeFavorite(Favorite $favorite): static
    {
        if ($this->favorites->removeElement($favorite)) {
            // set the owning side to null (unless already changed)
            if ($favorite->getProduct() === $this) {
                $favorite->setProduct(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, OrderItem>
     */
    public function getOrderItems(): Collection
    {
        return $this->orderItems;
    }

    public function addOrderItem(OrderItem $orderItem): static
    {
        if (!$this->orderItems->contains($orderItem)) {
            $this->orderItems->add($orderItem);
            $orderItem->setProduct($this);
        }

        return $this;
    }

    public function removeOrderItem(OrderItem $orderItem): static
    {
        if ($this->orderItems->removeElement($orderItem)) {
            // set the owning side to null (unless already changed)
            if ($orderItem->getProduct() === $this) {
                $orderItem->setProduct(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Feedback>
     */
    public function getFeedbacks(): Collection
    {
        return $this->feedbacks;
    }

    /**
     * @return Collection<int, ProductQuestion>
     */
    public function getProductQuestions(): Collection
    {
        return $this->productQuestions;
    }

    public function addProductQuestion(ProductQuestion $productQuestion): static
    {
        if (!$this->productQuestions->contains($productQuestion)) {
            $this->productQuestions->add($productQuestion);
            $productQuestion->setProduct($this);
        }

        return $this;
    }

    public function removeProductQuestion(ProductQuestion $productQuestion): static
    {
        if ($this->productQuestions->removeElement($productQuestion)) {
            // set the owning side to null (unless already changed)
            if ($productQuestion->getProduct() === $this) {
                $productQuestion->setProduct(null);
            }
        }

        return $this;
    }
}
