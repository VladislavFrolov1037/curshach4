<?php

namespace App\Dto\Seller;

use Symfony\Component\Validator\Constraints as Assert;

class EditSellerDto
{
    #[Assert\Email()]
    #[Assert\NotBlank(allowNull: true)]
    public ?string $email = null;

    #[Assert\Length(min: 2, max: 255)]
    #[Assert\NotBlank(allowNull: true)]
    public ?string $name = null;

    #[Assert\Length(max: 255)]
    #[Assert\NotBlank(allowNull: true)]
    public ?string $description = null;

    #[Assert\Choice(choices: ['company', 'individual'], message: 'Тип должен быть либо "компания", либо "частное лицо".')]
    #[Assert\NotBlank(allowNull: true)]
    public ?string $type = null;

    #[Assert\Regex(pattern: '/^\+?[0-9\s\-]+$/', message: 'Номер телефона должен быть действительным.')]
    #[Assert\NotBlank(allowNull: true)]
    public ?string $phone = null;

    #[Assert\Regex(pattern: '/^[A-Za-z0-9\-]+$/', message: 'Налоговый идентификатор должен быть действительного формата.')]
    #[Assert\NotBlank(allowNull: true)]
    public ?string $taxId = null;

    #[Assert\Length(min: 5, max: 50, minMessage: 'Длина паспорта должна составлять не менее {{ limit }} символов.')]
    #[Assert\NotBlank(allowNull: true)]
    public ?string $passport = null;

    #[Assert\Length(max: 255)]
    #[Assert\NotBlank(allowNull: true)]
    public ?string $address = null;

    #[Assert\NotBlank(allowNull: true)]
    public ?string $cardNumber = null;
}
