<?php

namespace App\Dto\User;

use App\Repository\UserRepository;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\Validator\Context\ExecutionContextInterface;
use App\Validator as AcmeAssert;

class RegisterUserDto
{
    #[Assert\NotBlank()]
    #[Assert\Email()]
    #[AcmeAssert\UniqueEmail()]
    public string $email;

    #[Assert\NotBlank()]
    #[Assert\Length(min: 6, minMessage: 'Минимальная длина пароля 8 символов')]
    public string $password;

    #[Assert\NotBlank()]
    #[Assert\EqualTo(propertyPath: 'password', message: 'Пароли не совпадают')]
    public string $confirmPassword;

    #[Assert\NotBlank()]
    public string $name;

    #[Assert\Choice(choices: ['male', 'female'])]
    public string $gender;

    #[Assert\NotBlank(allowNull: true)]
    public ?string $phone = null;
}
