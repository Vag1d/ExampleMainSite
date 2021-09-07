<?php
namespace App\EventListener;

use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Event\GetResponseForExceptionEvent;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use App\Entity\InteractiveLog;
use Doctrine\ORM\EntityManager;
use Symfony\Component\HttpFoundation\RequestStack;

class ExceptionListener
{
    private $em;
    private $security;
    private $requestStack;

    public function __construct(EntityManager $em, TokenStorageInterface $security, RequestStack $requestStack)
    {
        $this->em = $em;
        $this->security = $security;
        $this->requestStack = $requestStack;
    }

    public function onKernelException(GetResponseForExceptionEvent $event)
    {
        // You get the exception object from the received event
        $exception = $event->getException();
        $message = sprintf(
            '%s Code: %s',
            $exception->getMessage(),
            $exception->getCode()
        );

        $new_log = new InteractiveLog();
        if ($this->security->getToken() !== null && is_object($this->security->getToken()->getUser())) {
            $new_log->setInitiator($this->security->getToken()->getUser());
        }
        $new_log->setUrl($this->requestStack->getCurrentRequest()->getRequestUri());
        $new_log->setMessage($message);
        $new_log->setController($this->requestStack->getCurrentRequest()->get('_controller'));
        $new_log->setMethod($this->requestStack->getCurrentRequest()->getMethod());
        $new_log->setIpAddresses($this->requestStack->getCurrentRequest()->getClientIps());
        $params = [];
        if (!empty($this->requestStack->getCurrentRequest()->attributes->all())) {
            $params['attributes'] = $this->requestStack->getCurrentRequest()->attributes->all();
        }
        if (!empty($this->requestStack->getCurrentRequest()->query->all())) {
            $params['get'] = $this->requestStack->getCurrentRequest()->query->all();
        }
        if (!empty($this->requestStack->getCurrentRequest()->request->all())) {
            $params['post'] = $this->requestStack->getCurrentRequest()->request->all();
        }
        $new_log->setRequestParams($params);
        $this->em->persist($new_log);
        $this->em->flush();
    }
}
