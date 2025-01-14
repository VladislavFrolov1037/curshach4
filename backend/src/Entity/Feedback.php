<?php

namespace App\Entity;

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
    private ?User $user = null;

    #[ORM\ManyToOne(inversedBy: 'feedback')]
    private ?Product $product = null;

    #[ORM\ManyToOne(inversedBy: 'feedback')]
    private ?Order $order_id = null;

    #[ORM\Column]
    private ?int $rating = null;

    #[ORM\Column(length: 255)]
    private ?string $comment = null;

    #[ORM\Column(length: 255)]
    private ?string $image = null;

    #[ORM\Column(length: 255)]
    private ?string $status = null;

    #[ORM\Column]
    private ?\DateTimeImmutable $createdAt = null;

    /**
     * @var Collection<int, FeedbackReply>
     */
    #[ORM\OneToMany(targetEntity: FeedbackReply::class, mappedBy: 'feedback')]
    private Collection $feedbackReplies;

    /**
     * @var Collection<int, FeedbackReport>
     */
    #[ORM\OneToMany(targetEntity: FeedbackReport::class, mappedBy: 'feedback')]
    private Collection $feedbackReports;

    public function __construct()
    {
        $this->feedbackReplies = new ArrayCollection();
        $this->feedbackReports = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
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

    public function getOrderId(): ?Order
    {
        return $this->order_id;
    }

    public function setOrderId(?Order $order_id): static
    {
        $this->order_id = $order_id;

        return $this;
    }

    public function getRating(): ?int
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

    public function setComment(string $comment): static
    {
        $this->comment = $comment;

        return $this;
    }

    public function getImage(): ?string
    {
        return $this->image;
    }

    public function setImage(string $image): static
    {
        $this->image = $image;

        return $this;
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

    public function getCreatedAt(): ?\DateTimeImmutable
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
            // set the owning side to null (unless already changed)
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
            // set the owning side to null (unless already changed)
            if ($feedbackReport->getFeedback() === $this) {
                $feedbackReport->setFeedback(null);
            }
        }

        return $this;
    }
}
