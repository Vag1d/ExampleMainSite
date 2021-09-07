<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use GuzzleHttp\Client;
use App\Entity\Zabbix;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Security\Core\Security;

/**
 * @Route("/abonent_info")
 */

class ZabbixController extends AbstractController
{
    /**
     * @Route("/ajax_zabbix", methods={"POST"}, name="ajax_zabbix")
     */
    public function ajaxZabbix(Request $request)
    {
        $this->get('session')->save();
        if (!$request->isXmlHttpRequest()) {
            return new JsonResponse([
                'status' => 'Error',
                'message' => 'Послан не ajax запрос!'
            ], 400);
        } else {
            $ocato = explode(":", $request->request->get('ocato'))[0];
            $zabbix = new Zabbix($ocato);
            return new JsonResponse([
                "status" => "OK",
                "zabbix" => [
                    "maps" => $zabbix->getMaps(),
                    "interfaces" => $zabbix->getInterfaces(),
                    "items" => $zabbix->getItems(),
                    "hostid" => $zabbix->getHostid(),
                ],
            ]);
        }
    }
}
