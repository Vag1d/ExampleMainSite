<?php

namespace App\Repository;

use App\Entity\UsersOnlineMax;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Symfony\Bridge\Doctrine\RegistryInterface;

/**
 * @method UsersOnlineMax|null find($id, $lockMode = null, $lockVersion = null)
 * @method UsersOnlineMax|null findOneBy(array $criteria, array $orderBy = null)
 * @method UsersOnlineMax[]    findAll()
 * @method UsersOnlineMax[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class UsersOnlineMaxRepository extends ServiceEntityRepository
{
    public function __construct(RegistryInterface $registry)
    {
        parent::__construct($registry, UsersOnlineMax::class);
    }

    // /**
    //  * @return UsersOnlineMax[] Returns an array of UsersOnlineMax objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('u')
            ->andWhere('u.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('u.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?UsersOnlineMax
    {
        return $this->createQueryBuilder('u')
            ->andWhere('u.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
