<?php

namespace App\Repository;

use App\Entity\UploadDiagnostics;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Symfony\Bridge\Doctrine\RegistryInterface;

/**
 * @method UploadDiagnostics|null find($id, $lockMode = null, $lockVersion = null)
 * @method UploadDiagnostics|null findOneBy(array $criteria, array $orderBy = null)
 * @method UploadDiagnostics[]    findAll()
 * @method UploadDiagnostics[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class UploadDiagnosticsRepository extends ServiceEntityRepository
{
    public function __construct(RegistryInterface $registry)
    {
        parent::__construct($registry, UploadDiagnostics::class);
    }

    // /**
    //  * @return UploadDiagnostics[] Returns an array of UploadDiagnostics objects
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
    public function findOneBySomeField($value): ?UploadDiagnostics
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
