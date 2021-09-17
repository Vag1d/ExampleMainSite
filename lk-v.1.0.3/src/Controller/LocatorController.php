<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use GuzzleHttp\Client;
use App\Entity\Locator;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

/**
 * @Route("/abonent_info")
 */

class LocatorController extends AbstractController
{

    /**
     * @Route("/ajax_locator", methods={"POST"}, name="ajax_locator")
     */
    public function ajaxLocator(Request $request)
    {
        $this->get('session')->save();
        ini_set('max_execution_time', 180);
        set_time_limit(180);
        if (!$request->isXmlHttpRequest()) {
            return new JsonResponse([
                'status' => 'Error',
                'message' => 'Послан не ajax запрос!'
            ], 400);
        } else {
            $ip = $request->request->get('ip');
            if (!empty($ip)) {
                $client = new Client(["verify" => false]);
                $locator_info = new Locator($client, $ip);
                if ($locator_info->getDeviceIp() !== null) {
                    return new JsonResponse([
                        "status" => "OK",
                        "locator" => [
                            "ip" => $locator_info->getDeviceIp(),
                            "okato" => $locator_info->getOkato(),
                            "serial_number" => $locator_info->getSerialNumber(),
                            "name" => $locator_info->getDeviceName(),
                            "manufacturer" => $locator_info->getManufacturer(),
                            "model" => $locator_info->getModel(),
                            "firmware" => $locator_info->getFirmware(),
                            "cpu" => $locator_info->getCpu(),
                            "uptime" => $locator_info->getUptime(),
                            "ports_info" => $locator_info->getPortsInfo(),
                        ],
                    ]);
                } else {
                    return new JsonResponse([
                        'status' => 'OK',
                        'not_found' => true,
                    ]);
                }
            } else {
                return new JsonResponse([
                    'status' => 'OK',
                    'content' => $this->render('billing/_billing_info.html.twig', ['error' => 'Введите номер договора'])->getContent()
                ]);
            }
        }
    }
}
