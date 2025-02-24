<?php

namespace App\Entity;

use App\Enum\ReactionType;
use App\Repository\FeedbackReactionRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: FeedbackReactionRepository::class)]
class FeedbackReaction
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(cascade: ['persist', 'remove'], inversedBy: 'feedbackReactions')]
    private ?Feedback $feedback = null;

    #[ORM\ManyToOne(inversedBy: 'feedbackReactions')]
    private ?User $user = null;

    #[ORM\Column(enumType: ReactionType::class)]
    private ?ReactionType $reactionType = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getFeedback(): ?Feedback
    {
        return $this->feedback;
    }

    public function setFeedback(?Feedback $feedback): static
    {
        $this->feedback = $feedback;

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

    public function getReactionType(): ?ReactionType
    {
        return $this->reactionType;
    }

    public function setReactionType(ReactionType $reactionType): static
    {
        $this->reactionType = $reactionType;

        return $this;
    }
}
