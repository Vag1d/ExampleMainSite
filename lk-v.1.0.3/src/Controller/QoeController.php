<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use GuzzleHttp\Client;
use App\Entity\Qoe;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Security\Core\Security;

/**
 * @Route("/abonent_info")
 */

class QoeController extends AbstractController
{
    /**
     * @Route("/ajax_qoe", methods={"POST"}, name="ajax_qoe")
     */
    public function ajaxQoe(Request $request)
    {
        $this->get('session')->save();
        if (!$request->isXmlHttpRequest()) {
            return new JsonResponse([
                'status' => 'Error',
                'message' => 'Послан не ajax запрос!'
            ], 400);
        } else {
            $client = new Client();
            $num_contract = $request->request->get('num_contract');
            if (!empty($num_contract)) {
                $qoe_data = new Qoe($client, $num_contract);
                if ($qoe_data->getError() !== null) {
                    return new JsonResponse([
                        "status" => "OK",
                        "content" => $this->render('qoe/_qoe_data.html.twig', [
                            'qoe_error' => $qoe_data->getError(),
                        ])->getContent(),
                    ]);
                } else {
                    return new JsonResponse([
                        "status" => "OK",
                        "qoe" => [
                            "total_sessions" => $qoe_data->getTotalSessions(),
                            "median_rtt" => $qoe_data->getMedianRtt(),
                            "long_sessions" => $qoe_data->getLongSessions(),
                            "average_rtt" => $qoe_data->getAverageRtt(),
                            "qoe_graph" => $qoe_data->getQoeGraph(),
                            "qoe_table_data" => $qoe_data->getQoeTableData()
                        ],
                    ]);
                }
            } else {
                return new JsonResponse([
                    "status" => "OK",
                    "content" => $this->render('billing/_qoe_data.html.twig', [
                        'qoe_error' => ['message' => 'Введите номер договора'],
                    ])->getContent(),
                ]);
            }
        }
    }
}
