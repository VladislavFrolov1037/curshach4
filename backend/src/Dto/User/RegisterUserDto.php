<?php

namespace App\Dto\User;

use App\Validator as AcmeAssert;
use Symfony\Component\Validator\Constraints as Assert;

class RegisterUserDto
{
    #[Assert\NotBlank()]
    #[Assert\Email()]
    #[AcmeAssert\UniqueEmail()]
    public string $email;

    #[Assert\NotBlank()]
    #[Assert\Length(min: 6, minMessage: 'Минимальная длина пароля 6 символов')]
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
