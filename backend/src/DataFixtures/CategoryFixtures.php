<?php

namespace App\DataFixtures;

use App\Entity\Category;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class CategoryFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        //        $category = new Category();
        //
        //
        //
        //         $manager->persist();
        //
        //        $manager->flush();
    }
}
