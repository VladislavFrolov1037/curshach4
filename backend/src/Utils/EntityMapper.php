<?php

namespace App\Utils;

class EntityMapper
{
    public static function mapDtoToEntity(object $dto, object $entity): void
    {
        $reflectionDto = new \ReflectionClass($dto);
        $reflectionEntity = new \ReflectionClass($entity);

        foreach ($reflectionDto->getProperties() as $property) {
            $value = $property->getValue($dto);

            if ($value !== null) {
                $setter = 'set' . ucfirst($property->getName());
                if ($reflectionEntity->hasMethod($setter)) {
                    $entity->$setter($value);
                }
            }
        }
    }

}