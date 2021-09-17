<?php
namespace App\EventListener;

use Symfony\Component\Security\Core\SecurityContext;
use Symfony\Component\HttpKernel\Event\FilterControllerEvent;
use Symfony\Component\HttpKernel\HttpKernel;
use Doctrine\ORM\EntityManagerInterface;
use Acme\UserBundle\Entity\User;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Doctrine\Bundle\DoctrineBundle\Registry;

/**
 * Listener that updates the last activity of the authenticated user
 */
class ActivityListener
{
    protected $securityContext;
    protected $em;
    protected $doctrine;

    public function __construct(TokenStorageInterface $securityContext, EntityManagerInterface $em, Registry $doctrine)
    {
        $this->securityContext = $securityContext;
        $this->em = $em;
        $this->doctrine = $doctrine;
    }

    /**
    * Update the user "lastActivity" on each request
    * @param FilterControllerEvent $event
    */
    public function onCoreController(FilterControllerEvent $event)
    {
        // Check that the current request is a "MASTER_REQUEST"
        // Ignore any sub-request
        if ($event->getRequestType() !== HttpKernel::MASTER_REQUEST) {
            return;
        }

        // Check token authentication availability
        if ($this->securityContext->getToken() && is_object($this->securityContext->getToken()->getUser())) {
            $user = $this->securityContext->getToken()->getUser();

            $allip = [];
            $ip = $_SERVER['REMOTE_ADDR'];
            $date = new \DateTime();
            $convert_date = $date->format("d.m.Y H:i:s");
            $old_ip_list = $user->getActiveIpAddress();
            $new_ip_list = [$ip => $convert_date];
            $allip = array_merge($old_ip_list, $new_ip_list);
            arsort($allip);
            // if (!($user->isActiveNow())) {
            $user->setLastActivityAt($date);
            $user->setActiveIpAddress($allip);
            if (!$this->em->isOpen()) {
                $this->em = $this->doctrine->resetManager();
            }
            $this->em->flush($user);
            // }
        }
    }
}
