<?php

namespace App\Dto\User;

use App\Repository\UserRepository;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\Validator\Context\ExecutionContextInterface;

class RegisterUserDto
{
    #[Assert\NotBlank()]
    #[Assert\Email()]
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

    private UserRepository $userRepository;


    public function __construct(UserRepository $userRepository)
    {
        $this->userRepository = $userRepository;
    }

    #[Assert\Callback]
    public function validateUniqueEmail(ExecutionContextInterface $context): void
    {
        if ($this->userRepository->findOneBy(['email' => $this->email])) {
            $context->buildViolation('Данная почта уже зарегистрирована.')
                ->atPath('email')
                ->addViolation();
        }
    }

    public function populate(array $data): void
    {
        $this->email = $data['email'] ?? '';
        $this->password = $data['password'] ?? '';
        $this->confirmPassword = $data['confirmPassword'] ?? '';
        $this->name = $data['name'] ?? '';
        $this->gender = $data['gender'] ?? '';
        $this->phone = $data['phone'] ?? null;
    }
}
