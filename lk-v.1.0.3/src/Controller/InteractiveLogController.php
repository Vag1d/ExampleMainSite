<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use App\Repository\InteractiveLogRepository;
use Symfony\Component\HttpFoundation\Request;

class InteractiveLogController extends AbstractController
{
    /**
     * @Route("/interactive_log", name="interactive_log")
     */
    public function index(InteractiveLogRepository $logRepository, Request $request)
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
}
