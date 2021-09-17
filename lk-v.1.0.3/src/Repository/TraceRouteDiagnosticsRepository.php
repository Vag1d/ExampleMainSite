<?php

namespace App\Repository;

use App\Entity\TraceRouteDiagnostics;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Symfony\Bridge\Doctrine\RegistryInterface;

/**
 * @method TraceRouteDiagnostics|null find($id, $lockMode = null, $lockVersion = null)
 * @method TraceRouteDiagnostics|null findOneBy(array $criteria, array $orderBy = null)
 * @method TraceRouteDiagnostics[]    findAll()
 * @method TraceRouteDiagnostics[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class TraceRouteDiagnosticsRepository extends ServiceEntityRepository
{
    public function __construct(RegistryInterface $registry)
    {
        parent::__construct($registry, TraceRouteDiagnostics::class);
    }

    // /**
    //  * @return TraceRouteDiagnostics[] Returns an array of TraceRouteDiagnostics objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('t')
            ->andWhere('t.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('t.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?TraceRouteDiagnostics
    {
        return $this->createQueryBuilder('t')
            ->andWhere('t.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
