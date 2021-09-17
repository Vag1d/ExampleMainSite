<?php

namespace App\Repository;

use App\Entity\ClientErrorsLog;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Symfony\Bridge\Doctrine\RegistryInterface;

/**
 * @method ClientErrorsLog|null find($id, $lockMode = null, $lockVersion = null)
 * @method ClientErrorsLog|null findOneBy(array $criteria, array $orderBy = null)
 * @method ClientErrorsLog[]    findAll()
 * @method ClientErrorsLog[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ClientErrorsLogRepository extends ServiceEntityRepository
{
    public function __construct(RegistryInterface $registry)
    {
        parent::__construct($registry, ClientErrorsLog::class);
    }

    // /**
    //  * @return ClientErrorsLog[] Returns an array of ClientErrorsLog objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('c')
            ->andWhere('c.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('c.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?ClientErrorsLog
    {
        return $this->createQueryBuilder('c')
            ->andWhere('c.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
