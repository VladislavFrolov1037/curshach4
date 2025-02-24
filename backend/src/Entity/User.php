<?php

namespace App\Entity;

use App\Repository\UserRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;

#[ORM\Entity(repositoryClass: UserRepository::class)]
#[ORM\UniqueConstraint(name: 'UNIQ_IDENTIFIER_EMAIL', fields: ['email'])]
class User implements UserInterface, PasswordAuthenticatedUserInterface
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 180)]
    private ?string $email = null;

    /**
     * @var list<string> The user roles
     */
    #[ORM\Column]
    private array $roles = ['ROLE_USER'];

    /**
     * @var string The hashed password
     */
    #[ORM\Column]
    private ?string $password = null;

    #[ORM\Column(length: 50)]
    private ?string $name = null;

    #[ORM\Column(length: 10)]
    private ?string $gender = null;

    #[ORM\Column(type: Types::DECIMAL, precision: 10, scale: 2, nullable: true)]
    private ?string $discount = null;

    #[ORM\Column(length: 100)]
    private ?string $phone = null;

    #[ORM\Column]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\OneToOne(targetEntity: Seller::class, mappedBy: 'user', cascade: ['persist', 'remove'])]
    private ?Seller $seller = null;

    /**
     * @var Collection<int, ViewedProduct>
     */
    #[ORM\OneToMany(targetEntity: ViewedProduct::class, mappedBy: 'user', cascade: ['persist', 'remove'])]
    private Collection $viewedProducts;

    #[ORM\OneToOne(targetEntity: Cart::class, mappedBy: 'user', cascade: ['persist', 'remove'])]
    private ?Cart $cart = null;

    /**
     * @var Collection<int, Favorite>
     */
    #[ORM\OneToMany(targetEntity: Favorite::class, mappedBy: 'user', cascade: ['persist', 'remove'])]
    private Collection $favorites;

    /**
     * @var Collection<int, Order>
     */
    #[ORM\OneToMany(targetEntity: Order::class, mappedBy: 'user', cascade: ['persist', 'remove'])]
    private Collection $orders;

    /**
     * @var Collection<int, Feedback>
     */
    #[ORM\OneToMany(targetEntity: Feedback::class, mappedBy: 'user')]
    private Collection $feedback;

    /**
     * @var Collection<int, FeedbackReply>
     */
    #[ORM\OneToMany(targetEntity: FeedbackReply::class, mappedBy: 'user')]
    private Collection $feedbackReplies;

    /**
     * @var Collection<int, FeedbackReport>
     */
    #[ORM\OneToMany(targetEntity: FeedbackReport::class, mappedBy: 'user')]
    private Collection $feedbackReports;

    /**
     * @var Collection<int, FeedbackReaction>
     */
    #[ORM\OneToMany(targetEntity: FeedbackReaction::class, mappedBy: 'user')]
    private Collection $feedbackReactions;

    public function __construct()
    {
        $this->viewedProducts = new ArrayCollection();
        $this->orders = new ArrayCollection();
        $this->feedback = new ArrayCollection();
        $this->feedbackReplies = new ArrayCollection();
        $this->feedbackReports = new ArrayCollection();
        $this->feedbackReactions = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): static
    {
        $this->email = $email;

        return $this;
    }

    /**
     * A visual identifier that represents this user.
     *
     * @see UserInterface
     */
    public function getUserIdentifier(): string
    {
        return (string) $this->email;
    }

    /**
     * @see UserInterface
     *
     * @return list<string>
     */
    public function getRoles(): array
    {
        $roles = $this->roles;
        // guarantee every user at least has ROLE_USER
        $roles[] = 'ROLE_USER';

        return array_unique($roles);
    }

    /**
     * @param list<string> $roles
     */
    public function setRoles(array $roles): static
    {
        $this->roles = $roles;

        return $this;
    }

    /**
     * @see PasswordAuthenticatedUserInterface
     */
    public function getPassword(): ?string
    {
        return $this->password;
    }

    public function setPassword(string $password): static
    {
        $this->password = $password;

        return $this;
    }

    /**
     * @see UserInterface
     */
    public function eraseCredentials(): void
    {
        // If you store any temporary, sensitive data on the user, clear it here
        // $this->plainPassword = null;
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

    public function getGender(): ?string
    {
        return $this->gender;
    }

    public function setGender(string $gender): static
    {
        $this->gender = $gender;

        return $this;
    }

    public function getDiscount(): ?string
    {
        return $this->discount;
    }

    public function setDiscount(?string $discount): static
    {
        $this->discount = $discount;

        return $this;
    }

    public function getPhone(): ?string
    {
        return $this->phone;
    }

    public function setPhone(string $phone): static
    {
        $this->phone = $phone;

        return $this;
    }

    public function getCreatedAt(): ?\DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function setCreatedAt(\DateTimeImmutable $createdAt): static
    {
        $this->createdAt = $createdAt;

        return $this;
    }

    public function isSeller(): bool
    {
        return in_array('ROLE_SELLER', $this->getRoles());
    }

    public function isAdmin(): bool
    {
        return in_array('ROLE_ADMIN', $this->getRoles());
    }

    public function getSeller(): ?Seller
    {
        return $this->seller;
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
            $viewedProduct->setUser($this);
        }

        return $this;
    }

    public function removeViewedProduct(ViewedProduct $viewedProduct): static
    {
        if ($this->viewedProducts->removeElement($viewedProduct)) {
            // set the owning side to null (unless already changed)
            if ($viewedProduct->getUser() === $this) {
                $viewedProduct->setUser(null);
            }
        }

        return $this;
    }

    public function getCart(): ?Cart
    {
        return $this->cart;
    }

    public function setCart(?Cart $cart): static
    {
        $this->cart = $cart;

        return $this;
    }

    /**
     * @return Collection<int, Order>
     */
    public function getOrders(): Collection
    {
        return $this->orders;
    }

    public function addOrder(Order $order): static
    {
        if (!$this->orders->contains($order)) {
            $this->orders->add($order);
            $order->setUser($this);
        }

        return $this;
    }

    public function removeOrder(Order $order): static
    {
        if ($this->orders->removeElement($order)) {
            // set the owning side to null (unless already changed)
            if ($order->getUser() === $this) {
                $order->setUser(null);
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
            $favorite->setUser($this);
        }

        return $this;
    }

    public function removeFavorite(Favorite $favorite): static
    {
        if ($this->favorites->removeElement($favorite)) {
            // set the owning side to null (unless already changed)
            if ($favorite->getUser() === $this) {
                $favorite->setUser(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Feedback>
     */
    public function getFeedback(): Collection
    {
        return $this->feedback;
    }

    public function addFeedback(Feedback $feedback): static
    {
        if (!$this->feedback->contains($feedback)) {
            $this->feedback->add($feedback);
            $feedback->setUser($this);
        }

        return $this;
    }

    public function removeFeedback(Feedback $feedback): static
    {
        if ($this->feedback->removeElement($feedback)) {
            // set the owning side to null (unless already changed)
            if ($feedback->getUser() === $this) {
                $feedback->setUser(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, FeedbackReply>
     */
    public function getFeedbackReplies(): Collection
    {
        return $this->feedbackReplies;
    }

    public function addFeedbackReply(FeedbackReply $feedbackReply): static
    {
        if (!$this->feedbackReplies->contains($feedbackReply)) {
            $this->feedbackReplies->add($feedbackReply);
            $feedbackReply->setUser($this);
        }

        return $this;
    }

    public function removeFeedbackReply(FeedbackReply $feedbackReply): static
    {
        if ($this->feedbackReplies->removeElement($feedbackReply)) {
            // set the owning side to null (unless already changed)
            if ($feedbackReply->getUser() === $this) {
                $feedbackReply->setUser(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, FeedbackReport>
     */
    public function getFeedbackReports(): Collection
    {
        return $this->feedbackReports;
    }

    public function addFeedbackReport(FeedbackReport $feedbackReport): static
    {
        if (!$this->feedbackReports->contains($feedbackReport)) {
            $this->feedbackReports->add($feedbackReport);
            $feedbackReport->setUser($this);
        }

        return $this;
    }

    public function removeFeedbackReport(FeedbackReport $feedbackReport): static
    {
        if ($this->feedbackReports->removeElement($feedbackReport)) {
            // set the owning side to null (unless already changed)
            if ($feedbackReport->getUser() === $this) {
                $feedbackReport->setUser(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, FeedbackReaction>
     */
    public function getFeedbackReactions(): Collection
    {
        return $this->feedbackReactions;
    }

    public function addFeedbackReaction(FeedbackReaction $feedbackReaction): static
    {
        if (!$this->feedbackReactions->contains($feedbackReaction)) {
            $this->feedbackReactions->add($feedbackReaction);
            $feedbackReaction->setUser($this);
        }

        return $this;
    }

    public function removeFeedbackReaction(FeedbackReaction $feedbackReaction): static
    {
        if ($this->feedbackReactions->removeElement($feedbackReaction)) {
            // set the owning side to null (unless already changed)
            if ($feedbackReaction->getUser() === $this) {
                $feedbackReaction->setUser(null);
            }
        }

        return $this;
    }
}
