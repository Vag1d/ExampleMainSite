<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use GuzzleHttp\Client;

class Acs
{
    private $apiKey = "XE9-UlVvcFx9DXh4bwdlC3x0e11QI1Fadl9-K2VNeAR8DXgKF1NNKENVA1FCBlt6D39ZJFtVZllHLVwDF19GV2R2B1IHBWJaUgBbJWpafwFTKF1-AX1lGH1UAAxYMB9UU0FDB2p4YWQ=";
    private $api_baseUrl = "https://192.168.89.77:8080/secureFiles";
    private $apiDiagnostic = "/custom_api/getDiagnostic.php";
    private $apiAcs = "/actions/api/acs_api.php";
    private $client;

    public function __construct()
    {
        $this->client = new Client();
    }

    public function getAllInfo($mac)
    {
        if (preg_match("/\w{4}\.\w{4}\.\w{4}/", $mac)) {
            $mac = preg_replace("/(\w{2})(\w{2})\.(\w{2})(\w{2})\.(\w{2})(\w{2})/", "$1:$2:$3:$4:$5:$6", $mac);
        }
        $response = $this->client->request('POST', $this->api_baseUrl . $this->apiDiagnostic, [
            "verify" => false,
            "form_params" => [
                "token" => $this->apiKey,
                "mac" => $mac,
                "method" => "all",
            ]
        ]);

        return json_decode($response->getBody());
    }

    public function createPingTask(int $deviceID, string $address, int $repetitions = 4)
    {
        $response = $this->client->request('POST', $this->api_baseUrl . $this->apiAcs, [
            "verify" => false,
            "form_params" => [
                "token" => $this->apiKey,
                "device_id" => $deviceID,
                "method" => "diagnostic",
                "type" => "ping",
                "host" => $address,
                "repetitions" => $repetitions
            ]
        ]);

        return json_decode($response->getBody());
    }

    public function createTraceTask(int $deviceID, string $address, int $hops = 30)
    {
        $response = $this->client->request('POST', $this->api_baseUrl . $this->apiAcs, [
            "verify" => false,
            "form_params" => [
                "token" => $this->apiKey,
                "device_id" => $deviceID,
                "method" => "diagnostic",
                "type" => "traceroute",
                "host" => $address,
                "max_hop_count" => $hops,
                "timeout" => 5
            ]
        ]);

        return json_decode($response->getBody());
    }

    public function createUploadTask(int $deviceID, string $address, int $size)
    {
        $response = $this->client->request('POST', $this->api_baseUrl . $this->apiAcs, [
            "verify" => false,
            "form_params" => [
                "token" => $this->apiKey,
                "device_id" => $deviceID,
                "method" => "diagnostic",
                "type" => "upload",
                "host" => $address,
                "file_size" => $size,
            ]
        ]);

        return json_decode($response->getBody());
    }

    public function createDownloadTask(int $deviceID, string $address)
    {
        $response = $this->client->request('POST', $this->api_baseUrl . $this->apiAcs, [
            "verify" => false,
            "form_params" => [
                "token" => $this->apiKey,
                "device_id" => $deviceID,
                "method" => "diagnostic",
                "type" => "download",
                "host" => $address,
            ]
        ]);

        return json_decode($response->getBody());
    }

    public function taskCheck(int $taskID)
    {
        $response = $this->client->request('POST', $this->api_baseUrl . $this->apiAcs, [
            "verify" => false,
            "form_params" => [
                "token" => $this->apiKey,
                "taskId" => $taskID,
                "method" => "checkTaskStatus",
            ]
        ]);

        return json_decode($response->getBody());
    }

    public function getDiagnosticInfo(int $deviceID, string $method, bool $withActivities = false)
    {
        $response = $this->client->request('POST', $this->api_baseUrl . $this->apiDiagnostic, [
            "verify" => false,
            "form_params" => [
                "token" => $this->apiKey,
                "deviceID" => $deviceID,
                "method" => $method,
                "withActivities" => $withActivities,
            ]
        ]);

        return json_decode($response->getBody());
    }

    public function getWirelessNetworkSettings(int $deviceID, int $wlanId)
    {
        $response = $this->client->request('POST', $this->api_baseUrl . $this->apiDiagnostic, [
            "verify" => false,
            "form_params" => [
                "token" => $this->apiKey,
                "deviceID" => $deviceID,
                "wlanId" => $wlanId,
                "method" => "getWirelessNetwork",
            ]
        ]);

        return json_decode($response->getBody());
    }

    public function enableWirelessNetwork(int $deviceId, int $wlanId, int $wlanEnabled, int $wlanIndex, bool $withActivities = true)
    {
        $response = $this->client->request('POST', $this->api_baseUrl . $this->apiDiagnostic, [
            "verify" => false,
            "form_params" => [
                "token" => $this->apiKey,
                "deviceID" => $deviceId,
                "wlanId" => $wlanId,
                "wlanIndex" => $wlanIndex,
                "wlanEnabled" => $wlanEnabled,
                "method" => "enableWirelessNetwork",
                "withActivities" => $withActivities
            ]
        ]);

        return json_decode($response->getBody());
    }

    public function getActivities(int $deviceID)
    {
        $response = $this->client->request('POST', $this->api_baseUrl . $this->apiDiagnostic, [
            "verify" => false,
            "form_params" => [
                "token" => $this->apiKey,
                "deviceID" => $deviceID,
                "method" => "activity",
            ]
        ]);

        return json_decode($response->getBody());
    }

    public function refreshDevice(int $deviceID)
    {
        $response = $this->client->request('POST', $this->api_baseUrl . $this->apiAcs, [
            "verify" => false,
            "form_params" => [
                "token" => $this->apiKey,
                "deviceID" => $deviceID,
                "method" => "refresh",
            ]
        ]);

        return json_decode($response->getBody());
    }

    public function enableWirelessFrequency(int $deviceId, int $wlanEnabled, $wlanIndexes = [], bool $withActivities = true)
    {
        $response = $this->client->request('POST', $this->api_baseUrl . $this->apiDiagnostic, [
            "verify" => false,
            "form_params" => [
                "token" => $this->apiKey,
                "deviceID" => $deviceId,
                "wlanIndexes" => $wlanIndexes,
                "wlanEnabled" => $wlanEnabled,
                "method" => "enableWirelessFrequency",
                "withActivities" => $withActivities
            ]
        ]);

        return json_decode($response->getBody());
    }
}
