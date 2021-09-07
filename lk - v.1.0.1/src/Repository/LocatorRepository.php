<?php

namespace App\Repository;

use App\Entity\Locator;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Symfony\Bridge\Doctrine\RegistryInterface;

/**
 * @method Locator|null find($id, $lockMode = null, $lockVersion = null)
 * @method Locator|null findOneBy(array $criteria, array $orderBy = null)
 * @method Locator[]    findAll()
 * @method Locator[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class LocatorRepository extends ServiceEntityRepository
{
    public function __construct(RegistryInterface $registry)
    {
        parent::__construct($registry, Locator::class);
    }

    // /**
    //  * @return Locator[] Returns an array of Locator objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('l')
            ->andWhere('l.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('l.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?Locator
    {
        return $this->createQueryBuilder('l')
            ->andWhere('l.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
