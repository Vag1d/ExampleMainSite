<?php

namespace App\Repository;

use App\Entity\IpPingDiagnostics;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Symfony\Bridge\Doctrine\RegistryInterface;

/**
 * @method IpPingDiagnostics|null find($id, $lockMode = null, $lockVersion = null)
 * @method IpPingDiagnostics|null findOneBy(array $criteria, array $orderBy = null)
 * @method IpPingDiagnostics[]    findAll()
 * @method IpPingDiagnostics[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class IpPingDiagnosticsRepository extends ServiceEntityRepository
{
    public function __construct(RegistryInterface $registry)
    {
        parent::__construct($registry, IpPingDiagnostics::class);
    }

    // /**
    //  * @return IpPingDiagnostics[] Returns an array of IpPingDiagnostics objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('i')
            ->andWhere('i.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('i.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?IpPingDiagnostics
    {
        return $this->createQueryBuilder('i')
            ->andWhere('i.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
