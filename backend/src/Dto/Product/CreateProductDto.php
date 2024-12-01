<?php

namespace App\Dto\Product;

use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\Validator\Constraints as Assert;

class CreateProductDto
{
    #[Assert\NotBlank()]
    #[Assert\Length(min: 2, max: 255)]
    public ?string $name = null;

    #[Assert\NotBlank()]
    #[Assert\Length(max: 255)]
    public ?string $description = null;

    #[Assert\NotBlank()]
    public ?string $price = null;

    #[Assert\NotBlank()]
    public ?string $quantity = null;

    #[Assert\NotBlank()]
    public ?string $categoryId = null;

    #[Assert\NotBlank()]
    #[Assert\Image(mimeTypes: ['image/jpeg', 'image/png'], mimeTypesMessage: 'Файл должен быть изображением в формате JPEG или PNG.')]
    public ?UploadedFile $image = null;
}
