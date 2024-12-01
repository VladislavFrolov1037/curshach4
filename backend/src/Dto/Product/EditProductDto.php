<?php

namespace App\Dto\Product;

use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\Validator\Constraints as Assert;

class EditProductDto
{
    #[Assert\NotBlank(allowNull: true)]
    #[Assert\Length(min: 2, max: 255)]
    public ?string $name = null;

    #[Assert\NotBlank(allowNull: true)]
    #[Assert\Length(max: 255)]
    public ?string $description = null;

    #[Assert\NotBlank(allowNull: true)]
    public ?string $price = null;

    #[Assert\NotBlank(allowNull: true)]
    public ?string $quantity = null;

    #[Assert\NotBlank(allowNull: true)]
    public ?string $categoryId = null;

    #[Assert\NotBlank(allowNull: true)]
    #[Assert\Image(mimeTypes: ['image/jpeg', 'image/png'], mimeTypesMessage: 'Файл должен быть изображением в формате JPEG или PNG.')]
    public ?UploadedFile $image = null;
}
