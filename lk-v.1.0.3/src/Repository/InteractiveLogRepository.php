<?php

namespace App\Repository;

use App\Entity\InteractiveLog;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Symfony\Bridge\Doctrine\RegistryInterface;
use Doctrine\ORM\Query;
use Pagerfanta\Adapter\DoctrineORMAdapter;
use Pagerfanta\Pagerfanta;

/**
 * @method InteractiveLog|null find($id, $lockMode = null, $lockVersion = null)
 * @method InteractiveLog|null findOneBy(array $criteria, array $orderBy = null)
 * @method InteractiveLog[]    findAll()
 * @method InteractiveLog[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class InteractiveLogRepository extends ServiceEntityRepository
{
    public function __construct(RegistryInterface $registry)
    {
        parent::__construct($registry, InteractiveLog::class);
    }

    public function findLatest($page, ?array $search_params, $dates = null): Pagerfanta
    {
        $qb = $this->createQueryBuilder('l')
                ->orderBy('l.time', 'DESC');

        foreach ($search_params as $name => $param) {
            if ($param !== null && !empty($param)) {
                if ($name != "initiator") {
                    $qb->andWhere("lower(l." . $name . ") LIKE lower(:p_" . $name . ")")
                        ->setParameter('p_' . $name, '%' . $param . '%');
                } else {
                    $qb->addSelect('u')
                        ->leftJoin('l.initiator', 'u')
                        ->andWhere('lower(u.username) LIKE lower(:p_username)')
                        ->setParameter('p_username', '%' . $param . '%');
                }
            }
        }

        if ($dates !== null) {
            if (!empty($dates['start_date']) && !empty($dates['end_date'])) {
                $qb->andWhere('l.time BETWEEN :p_start AND :p_end')
                    ->setParameter('p_start', new \DateTime($dates['start_date']))
                    ->setParameter('p_end', new \DateTime($dates['end_date']));
            } elseif (!empty($dates['start_date'])) {
                $qb->andWhere('l.time > :p_start')
                    ->setParameter('p_start', new \DateTime($dates['start_date']));
            } elseif (!empty($dates['end_date'])) {
                $qb->andWhere('l.time < :p_end')
                    ->setParameter('p_end', new \DateTime($dates['end_date']));
            }
        }
        // dd($qb->getQuery()); exit();
        $paginator = new Pagerfanta(new DoctrineORMAdapter($qb->getQuery()));
        $paginator->setMaxPerPage(20);
        $paginator->setCurrentPage($page);

        return $paginator;
    }

    // /**
    //  * @return InteractiveLog[] Returns an array of InteractiveLog objects
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
    public function findOneBySomeField($value): ?InteractiveLog
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
