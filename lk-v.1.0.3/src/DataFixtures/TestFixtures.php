<?php

namespace App\DataFixtures;

use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\Persistence\ObjectManager;
use App\Entity\Test;

class TestFixtures extends Fixture
{
    public function load(ObjectManager $manager)
    {
	for ($i = 0; $i < 20; $i++) {
		$test = new Test();
		$test->setText("some random text with number " . rand(0, 1000));
		$test->setNumber(rand(100, 20000));
		$test->setField(rand(25000, 100000) / 1000);
		$test->setDateTime(new \DateTime());
		$manager->persist($test);
	}

        $manager->flush();
    }
}
