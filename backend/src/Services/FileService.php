<?php

namespace App\Services;

use Symfony\Component\HttpFoundation\File\UploadedFile;

class FileService
{
    private string $uploadDir;

    public function __construct(string $uploadDir)
    {
        $this->uploadDir = $uploadDir;
    }

    public function upload(UploadedFile $file): string
    {
        $fileName = uniqid().'.'.$file->guessExtension();

        $file->move($this->uploadDir, $fileName);

        return 'uploads/'.$fileName;
    }
}
