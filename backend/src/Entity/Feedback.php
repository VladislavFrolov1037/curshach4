<?php

namespace App\Entity;

use App\Enum\ReactionType;
use App\Repository\FeedbackRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: FeedbackRepository::class)]
class Feedback
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'feedback')]
    #[ORM\JoinColumn(nullable: false)]
    private User $user;

    #[ORM\ManyToOne(inversedBy: 'feedback')]
    #[ORM\JoinColumn(nullable: false)]
    private Product $product;

    #[ORM\Column]
    private int $rating;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $comment = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $image = null;

    #[ORM\Column(length: 255)]
    private string $status;

    #[ORM\Column]
    private \DateTimeImmutable $createdAt;

    /**
     * @var Collection<int, FeedbackReply>
     */
    #[ORM\OneToMany(targetEntity: FeedbackReply::class, mappedBy: 'feedback', cascade: ['remove'])]
    private Collection $feedbackReplies;

    /**
     * @var Collection<int, FeedbackReport>
     */
    #[ORM\OneToMany(targetEntity: FeedbackReport::class, mappedBy: 'feedback', cascade: ['remove'])]
    private Collection $feedbackReports;

    /**
     * @var Collection<int, FeedbackReaction>
     */
    #[ORM\OneToMany(targetEntity: FeedbackReaction::class, mappedBy: 'feedback', cascade: ['remove'])]
    private Collection $feedbackReactions;

    public function __construct()
    {
        $this->feedbackReplies = new ArrayCollection();
        $this->feedbackReports = new ArrayCollection();
        $this->createdAt = new \DateTimeImmutable();
        $this->feedbackReactions = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getUser(): User
    {
        return $this->user;
    }

    public function setUser(User $user): static
    {
        $this->user = $user;

        return $this;
    }

    public function getProduct(): Product
    {
        return $this->product;
    }

    public function setProduct(Product $product): static
    {
        $this->product = $product;

        return $this;
    }

    public function getRating(): int
    {
        return $this->rating;
    }

    public function setRating(int $rating): static
    {
        $this->rating = $rating;

        return $this;
    }

    public function getComment(): ?string
    {
        return $this->comment;
    }

    public function setComment(?string $comment): static
    {
        $this->comment = $comment;

        return $this;
    }

    public function getImage(): ?string
    {
        return $this->image;
    }

    public function setImage(?string $image): static
    {
        $this->image = $image;

        return $this;
    }

    public function getStatus(): string
    {
        return $this->status;
    }

    public function setStatus(string $status): static
    {
        $this->status = $status;

        return $this;
    }

    public function getCreatedAt(): \DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function setCreatedAt(\DateTimeImmutable $createdAt): static
    {
        $this->createdAt = $createdAt;

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
            $feedbackReply->setFeedback($this);
        }

        return $this;
    }

    public function removeFeedbackReply(FeedbackReply $feedbackReply): static
    {
        if ($this->feedbackReplies->removeElement($feedbackReply)) {
            if ($feedbackReply->getFeedback() === $this) {
                $feedbackReply->setFeedback(null);
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
            $feedbackReport->setFeedback($this);
        }

        return $this;
    }

    public function removeFeedbackReport(FeedbackReport $feedbackReport): static
    {
        if ($this->feedbackReports->removeElement($feedbackReport)) {
            if ($feedbackReport->getFeedback() === $this) {
                $feedbackReport->setFeedback(null);
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

    public function getLikes(): int
    {
        return count(array_filter($this->getFeedbackReactions()->toArray(), function ($feedbackReaction) {
            return ReactionType::TYPE_LIKE === $feedbackReaction->getReactionType();
        }));
    }

    public function getDislikes(): int
    {
        return count(array_filter($this->getFeedbackReactions()->toArray(), function ($feedbackReaction) {
            return ReactionType::TYPE_DISLIKE === $feedbackReaction->getReactionType();
        }));
    }
}
