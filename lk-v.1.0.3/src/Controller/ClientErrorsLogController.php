<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use App\Repository\ClientErrorsLogRepository;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Core\Security;
use Doctrine\ORM\EntityManagerInterface;
use App\Entity\ClientErrorsLog;
use Symfony\Component\HttpFoundation\JsonResponse;

class ClientErrorsLogController extends AbstractController
{
    /**
     * @Route("/client_log", name="client_log")
     */
    public function index(ClientErrorsLogRepository $logRepository, Request $request)
    {
        $url = $request->query->get('url', null);
        $initiator = $request->query->get('initiator', null);
        $controller = $request->query->get('controller', null);
        $method = $request->query->get('method', null);
        $message = $request->query->get('message', null);
        $start_date = $request->query->get('start_date', null);
        $end_date = $request->query->get('end_date', null);
        $dates = [
            "start_date" => $start_date,
            "end_date" => $end_date,
        ];
        $log = $logRepository->findLatest($request->query->get('page') ?? 1, [
            "url" => $url,
            "initiator" => $initiator,
            "controller" => $controller,
            "method" => $method,
            "message" => $message
        ], $dates);
        return $this->render('interactive_log/index.html.twig', [
            'log' => $log,
            'initiator' => $initiator,
            'url' => $url,
            'controller' => $controller,
            'method' => $method,
            'message' => $message,
            "start_date" => !empty($start_date) ? (new \DateTime($start_date))->format(DATE_RFC822) : null,
            "end_date" => !empty($end_date) ? (new \DateTime($end_date))->format(DATE_RFC822) : null
        ]);
    }

    /**
     * @Route("/client_log_add", name="client_log_add", methods={"POST"})
     */
    public function addRecord(EntityManagerInterface $em, Request $request, Security $security)
    {
        $log = new ClientErrorsLog();
        $log->setInitiator($security->getUser());
        $log->setStatucCode((int)$request->request->get('statusCode', null));
        $log->setStatusText($request->request->get('statusText', null));
        $log->setException($request->request->get('exception', null));
        $log->setTime(new \DateTime());
        $log->setService($request->request->get('service', null));
        $em->persist($log);
        $em->flush();
        return new JsonResponse([
            'status' => 'OK',
        ]);
    }
}
