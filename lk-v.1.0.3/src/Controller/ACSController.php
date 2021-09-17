<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use App\Entity\Acs;

/**
 * @Route("/abonent_info")
 */

class ACSController extends AbstractController
{
    /**
     * @Route("/ajax_acs", name="ajax_acs")
     */
    public function index(Request $request)
    {
        $this->get('session')->save();
        if (!$request->isXmlHttpRequest()) {
            return new JsonResponse([
                'status' => 'Error',
                'message' => 'Послан не ajax запрос!'
            ], 400);
        } else {
            // $num_contract = $request->request->get('num_contract');
            $mac = $request->request->get('mac');
            $acsInfo = (new Acs)->getAllInfo($mac);

            return new JsonResponse([
                'status' => 'OK',
                'acs_info' => $acsInfo ?? null
            ]);
        }
    }

    /**
     * @Route("/ajax_acs_pings", name="ajax_acs_pings")
     */
    public function pings(Request $request)
    {
        // TODO: доработать вывод, когда допилят ACS
        $this->get('session')->save();
        if (!$request->isXmlHttpRequest()) {
            return new JsonResponse([
                'status' => 'Error',
                'message' => 'Послан не ajax запрос!'
            ], 400);
        } else {
            $num_contract = $request->request->get('num_contract');
            $repository_acs = $this->getDoctrine()->getRepository(ACSClient::class);
            $acs = $repository_acs->findOneBy(['contract_number' => $num_contract]);
            $offset = 0;
            if ($acs !== null) {
                $repository_ping = $this->getDoctrine()->getRepository(IpPingDiagnostics::class);
                $offset = $request->request->get('offset') ?? 0;
                $pings = $repository_ping->findBy([
                    'device_id' => $acs->getDeviceId()
                ], [
                    'create_date' => 'DESC'
                ], 6, $offset);
                $normalizer = new ObjectNormalizer();
                $normalizer->setIgnoredAttributes(array('timezone'));
                $encoder = new JsonEncoder();
                $serializer = new Serializer(array($normalizer), array($encoder));
            }

            return new JsonResponse([
                'status' => 'OK',
                'pings' => isset($pings) ? $serializer->serialize($pings, 'json') : null,
            ]);
        }
    }

    /**
     * @Route("/ping_task_create", name="acs_ajax_pingTaskCreate")
     */
    public function pingTaskCreate(Request $request)
    {
        $this->get('session')->save();
        if (!$request->isXmlHttpRequest()) {
            return new JsonResponse([
                'status' => 'Error',
                'message' => 'Послан не ajax запрос!'
            ], 400);
        } else {
            $device_id = $request->request->get('device_id');
            $address = $request->request->get('address');
            $repetitions = $request->request->get('repetitions') ?? 4;
            $acsTask = new Acs();
            // $acsTask->createPingTask($device_id, $address, $repetitions);
            return new JsonResponse([
                'status' => 'OK',
                'task' => $acsTask->createPingTask($device_id, $address, $repetitions),
            ]);
        }
    }

    /**
     * @Route("/trace_task_create", name="acs_ajax_traceTaskCreate")
     */
    public function traceTaskCreate(Request $request)
    {
        $this->get('session')->save();
        if (!$request->isXmlHttpRequest()) {
            return new JsonResponse([
                'status' => 'Error',
                'message' => 'Послан не ajax запрос!'
            ], 400);
        } else {
            $device_id = $request->request->get('device_id');
            $address = $request->request->get('address');
            $hops = $request->request->get('hops') ?? 30;
            $acsTask = new Acs();
            return new JsonResponse([
                'status' => 'OK',
                'task' => $acsTask->createTraceTask($device_id, $address, $hops),
            ]);
        }
    }

    /**
     * @Route("/speed_task_create", name="acs_ajax_speedTaskCreate")
     */
    public function speedTaskCreate(Request $request)
    {
        $this->get('session')->save();
        if (!$request->isXmlHttpRequest()) {
            return new JsonResponse([
                'status' => 'Error',
                'message' => 'Послан не ajax запрос!'
            ], 400);
        } else {
            $device_id = $request->request->get('device_id');
            $address = $request->request->get('address');
            $type = $request->request->get('type');
            $acsTask = new Acs();
            if ($type === "upload") {
                $size = $request->request->get('size');
                $task = $acsTask->createUploadTask($device_id, $address, $size);
            } elseif ($type === "download") {
                $task = $acsTask->createDownloadTask($device_id, $address);
            }
            return new JsonResponse([
                'status' => 'OK',
                'task' => $task,
            ]);
        }
    }

    /**
     * @Route("/acs_task_check", name="acs_ajax_taskCheck")
     */
    public function taskCheck(Request $request)
    {
        $this->get('session')->save();
        if (!$request->isXmlHttpRequest()) {
            return new JsonResponse([
                'status' => 'Error',
                'message' => 'Послан не ajax запрос!'
            ], 400);
        } else {
            $taskID = $request->request->get('taskID');
            $acsTask = new Acs();
            $taskStatus = $acsTask->taskCheck($taskID)->{'Operation Status'};
            $device_id = $request->request->get('device_id');
            if ($taskStatus >= 2 && $request->request->get('type') !== null) {
                $taskType = $request->request->get('type');
                $taskResult = $acsTask->getDiagnosticInfo($device_id, $taskType, true);
            } elseif ($request->request->get('type') === null) {
                $taskResult = $acsTask->getActivities($device_id);
            }
            return new JsonResponse([
                'status' => 'OK',
                'task_status' => $taskStatus,
                'task_result' => $taskResult ?? null
            ]);
        }
    }

    /**
     * @Route("/ajax_acs_wireless_settings", name="acs_ajax_acsWirelessSettings")
     */
    public function getWirelessSettings(Request $request)
    {
        $this->get('session')->save();
        if (!$request->isXmlHttpRequest()) {
            return new JsonResponse([
                'status' => 'Error',
                'message' => 'Послан не ajax запрос!'
            ], 400);
        } else {
            $device_id = $request->request->get('device_id');
            $wlanId = $request->request->get('wlanId');
            $wlanInfo = (new Acs)->getWirelessNetworkSettings($device_id, $wlanId);

            return new JsonResponse([
                'status' => 'OK',
                'wlaninfo' => $wlanInfo->wlan ?? null,
                "wlan5ghz_ranges" => $wlanInfo->wlan5ghz_ranges ?? null,
                "wlanModes" => $wlanInfo->wlanModes ?? null,
            ]);
        }
    }

    /**
     * @Route("/ajax_acs_enable_wireless_network", name="acs_ajax_acsEnableWirelessNetwork")
     */
    public function enableWirelessNetwork(Request $request)
    {
        $this->get('session')->save();
        if (!$request->isXmlHttpRequest()) {
            return new JsonResponse([
                'status' => 'Error',
                'message' => 'Послан не ajax запрос!'
            ], 400);
        } else {
            $device_id = $request->request->get('device_id');
            $wlanId = $request->request->get('wlanId');
            $wlanIndex = $request->request->get('wlanIndex');
            $wlanEnabled = $request->request->get('wlanEnabled');
            $wlanTask = (new Acs)->enableWirelessNetwork($device_id, $wlanId, $wlanEnabled, $wlanIndex);

            return new JsonResponse([
                'status' => 'OK',
                'taskId' => $wlanTask->taskId ?? null,
                "activities" => $wlanTask->activities ?? null,
            ]);
        }
    }

    /**
     * @Route("/ajax_acs_refresh", name="ajax_acs_refresh")
     */
    public function refresh(Request $request)
    {
        $this->get('session')->save();
        if (!$request->isXmlHttpRequest()) {
            return new JsonResponse([
                'status' => 'Error',
                'message' => 'Послан не ajax запрос!'
            ], 400);
        } else {
            $device_id = $request->request->get('device_id');
            $acs = new Acs();
            $refreshTask = $acs->refreshDevice($device_id);
            $activities = $acs->getActivities($device_id);

            return new JsonResponse([
                'status' => 'OK',
                'taskId' => $refreshTask->result ?? null,
                "activities" => $activities->activities ?? null,
            ]);
        }
    }

    /**
     * @Route("/ajax_acs_enable_wireless_frequency", name="acs_ajax_acsEnableWirelessFrequency")
     */
    public function enableWirelessFrequency(Request $request)
    {
        $this->get('session')->save();
        if (!$request->isXmlHttpRequest()) {
            return new JsonResponse([
                'status' => 'Error',
                'message' => 'Послан не ajax запрос!'
            ], 400);
        } else {
            $device_id = $request->request->get('device_id');
            $wlanIndexes = $request->request->get('wlanIndexes');
            $wlanEnabled = $request->request->get('wlanEnabled');
            $wlanTask = (new Acs)->enableWirelessFrequency($device_id, $wlanEnabled, $wlanIndexes);

            return new JsonResponse([
                'status' => 'OK',
                'taskId' => $wlanTask->taskId ?? null,
                "activities" => $wlanTask->activities ?? null,
            ]);
        }
    }
}
