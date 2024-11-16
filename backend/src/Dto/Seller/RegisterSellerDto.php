<?php

namespace App\Dto\Seller;

use Symfony\Component\Validator\Constraints as Assert;

class RegisterSellerDto
{
    #[Assert\NotBlank()]
    #[Assert\Email()]
    public string $email;

    #[Assert\NotBlank()]
    #[Assert\Length(min: 2, max: 255)]
    public string $name;

    #[Assert\NotBlank()]
    #[Assert\Length(max: 255)]
    public string $description;

    #[Assert\NotBlank()]
    #[Assert\Choice(choices: ['company', 'individual'], message: 'Тип должен быть либо "компания", либо "частное лицо".')]
    public string $type;

    #[Assert\Regex(pattern: '/^\+?[0-9\s\-]+$/', message: 'Номер телефона должен быть действительным.')]
    public ?string $phone = null;

    #[Assert\Regex(pattern: '/^[A-Za-z0-9\-]+$/', message: 'Налоговый идентификатор должен быть действительного формата.')]
    public ?string $taxId = null;

    #[Assert\NotBlank(allowNull: true)]
    #[Assert\Length(min: 5, max: 50, minMessage: 'Длина паспорта должна составлять не менее {{ limit }} символов.')]
    public ?string $passport = null;

    #[Assert\Length(max: 255)]
    public ?string $address = null;
}
