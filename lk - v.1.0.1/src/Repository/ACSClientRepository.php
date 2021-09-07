<?php

namespace App\Repository;

use App\Entity\ACSClient;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Symfony\Bridge\Doctrine\RegistryInterface;

/**
 * @method ACSClient|null find($id, $lockMode = null, $lockVersion = null)
 * @method ACSClient|null findOneBy(array $criteria, array $orderBy = null)
 * @method ACSClient[]    findAll()
 * @method ACSClient[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ACSClientRepository extends ServiceEntityRepository
{
    public function __construct(RegistryInterface $registry)
    {
        parent::__construct($registry, ACSClient::class);
    }

    // /**
    //  * @return ACSClient[] Returns an array of ACSClient objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('a')
            ->andWhere('a.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('a.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?ACSClient
    {
        return $this->createQueryBuilder('a')
            ->andWhere('a.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
