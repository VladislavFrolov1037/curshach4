<?php

namespace App\Dto\User;

use App\Entity\User;
use App\Validator as AcmeAssert;
use Symfony\Component\Validator\Constraints as Assert;

class EditUserDto
{
    #[Assert\NotBlank(allowNull: true)]
    #[Assert\Email()]
    #[AcmeAssert\UniqueEmail(['entityClass' => User::class])]
    public ?string $email = null;

    #[Assert\NotBlank(allowNull: true)]
    public ?string $name = null;

    #[Assert\NotBlank(allowNull: true)]
    #[Assert\Choice(choices: ['male', 'female'])]
    public ?string $gender = null;

    #[Assert\NotBlank(allowNull: true)]
    public ?string $phone = null;

    #[Assert\NotBlank(allowNull: true)]
    public ?string $address = null;

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function getGender(): ?string
    {
        return $this->gender;
    }

    public function getPhone(): ?string
    {
        return $this->phone;
    }

    public function getAddress(): ?string
    {
        return $this->address;
    }
}
