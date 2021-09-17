<?php

namespace App\Command;

use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;
use App\Repository\UserRepository;
use App\Repository\UsersOnlineMaxRepository;
use App\Entity\UsersOnlineMax;
use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand;
use Doctrine\ORM\EntityManagerInterface;

class GetOnlineUsersCommand extends Command
{
    protected static $defaultName = 'app:get-online-users';
    private $userRepository;
    private $usersOnlineMaxRepository;
    private $em;

    public function __construct(EntityManagerInterface $em, UserRepository $userRepository, UsersOnlineMaxRepository $usersOnlineMaxRepository)
    {
        parent::__construct();
        $this->em = $em;
        $this->userRepository = $userRepository;
        $this->usersOnlineMaxRepository = $usersOnlineMaxRepository;
    }

    protected function configure()
    {
        $this
            ->setDescription('Показывает текущее количество пользователей и делает пометку о максимальном их количестве в день.')
        ;
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $io = new SymfonyStyle($input, $output);
        $usersCount = $this->userRepository->findOnline();
        $maxUsers = $this->usersOnlineMaxRepository->findOneBy([
            'date' => new \DateTime("midnight")
        ]);
        if ($maxUsers === null) {
            $maxUsers = new UsersOnlineMax();
            $maxUsers->setDate(new \DateTime("midnight"));
            $maxUsers->setCount(0);
        }
        if ($maxUsers->getCount() < $usersCount) {
            $maxUsers->setCount($usersCount);
            $this->em->persist($maxUsers);
            $this->em->flush();
        }
        $io->success('Сейчас онлайн: ' . $usersCount . '. За сегодня максимально: ' . $maxUsers->getCount());
    }
}
