<?php

namespace App\EventListener;

use App\Exception\ValidationException;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Event\ExceptionEvent;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Validator\ConstraintViolationListInterface;

class ValidationExceptionListener
{
    public function onKernelException(ExceptionEvent $event): void
    {
        $exception = $event->getThrowable();

        if ($exception instanceof ValidationException) {
            $violations = $exception->getViolations();
            $formattedErrors = $this->formatValidationErrors($violations);
            $response = new JsonResponse(['errors' => $formattedErrors], Response::HTTP_BAD_REQUEST);
            $event->setResponse($response);
        }
    }

    private function formatValidationErrors(ConstraintViolationListInterface $errors): array
    {
        $errorMessages = [];
        foreach ($errors as $error) {
            $field = explode('.', $error->getPropertyPath())[1] ?? $error->getPropertyPath();
            $errorMessages[$field] = $error->getMessage();
        }
        return $errorMessages;
    }
}
