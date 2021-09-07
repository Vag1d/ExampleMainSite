<?php

namespace App\Repository;

use App\Entity\DownloadDiagnostics;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Symfony\Bridge\Doctrine\RegistryInterface;

/**
 * @method DownloadDiagnostics|null find($id, $lockMode = null, $lockVersion = null)
 * @method DownloadDiagnostics|null findOneBy(array $criteria, array $orderBy = null)
 * @method DownloadDiagnostics[]    findAll()
 * @method DownloadDiagnostics[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class DownloadDiagnosticsRepository extends ServiceEntityRepository
{
    public function __construct(RegistryInterface $registry)
    {
        parent::__construct($registry, DownloadDiagnostics::class);
    }

    // /**
    //  * @return DownloadDiagnostics[] Returns an array of DownloadDiagnostics objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('d')
            ->andWhere('d.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('d.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?DownloadDiagnostics
    {
        return $this->createQueryBuilder('d')
            ->andWhere('d.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
