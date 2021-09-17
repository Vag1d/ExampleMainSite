<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use GuzzleHttp\Client;

class ACSTask
{
    private $apiKey = "XE9-UlVvcFx9DXh4bwdlC3x0e11QI1Fadl9-K2VNeAR8DXgKF1NNKENVA1FCBlt6D39ZJFtVZllHLVwDF19GV2R2B1IHBWJaUgBbJWpafwFTKF1-AX1lGH1UAAxYMB9UU0FDB2p4YWQ=";
    private $api_baseUrl = "https://192.168.89.77:8080/secureFiles/actions/api/acs_api.php";
    private $client;

    public function __construct()
    {
        $this->client = new Client();
        // echo "<pre>";
        // $response3 = $this->client->request('POST', $this->api_baseUrl, [
        //     "verify" => false,
        //     "form_params" => [
        //         "token" => $this->apiKey,
        //         "deviceID" => 10,
        //         "method" => "getSelectedParam",
        //         "name[0]" => "InternetGatewayDevice.DeviceInfo.MemoryStatus",
        //         "name[1]" => "InternetGatewayDevice.DeviceInfo.ProcessStatus.CPUUsage",
        //         "name[2]" => "InternetGatewayDevice.DeviceInfo.UpTime",
        //         "name[3]" => "InternetGatewayDevice.DeviceInfo.SoftwareVersion",
        //         "name[4]" => "InternetGatewayDevice.DeviceInfo.HardwareVersion",
        //         "name[5]" => "InternetGatewayDevice.DeviceInfo.SerialNumber",
        //         "name[6]" => "InternetGatewayDevice.DeviceInfo.ModelName",
        //         "name[7]" => "InternetGatewayDevice.DeviceInfo.Manufacturer",
        //         "name[8]" => "InternetGatewayDevice.WANDevice.1.WANEthernetInterfaceConfig.MACAddress",
        //         "name[9]" => "InternetGatewayDevice.WANDevice.1.WANConnectionDevice.1.WANIPConnection.1.ExternalIPAddress",
        //     ]
        // ]);
        // // $acsInfo = json_decode($response3->getBody());
        // // echo $acsInfo[0]->{'InternetGatewayDevice.DeviceInfo.MemoryStatus'}[0]->{'InternetGatewayDevice.DeviceInfo.MemoryStatus.Free'};
        // print_r(json_decode($response3->getBody()));
        // exit();
    }

    public function getAcsInfo(int $deviceID)
    {
        $response = $this->client->request('POST', $this->api_baseUrl, [
            "verify" => false,
            "form_params" => [
                "token" => $this->apiKey,
                "deviceID" => $deviceID,
                "method" => "getSelectedParam",
                "name[0]" => "InternetGatewayDevice.DeviceInfo.MemoryStatus",
                "name[1]" => "InternetGatewayDevice.DeviceInfo.ProcessStatus.CPUUsage",
                "name[2]" => "InternetGatewayDevice.DeviceInfo.UpTime",
                "name[3]" => "InternetGatewayDevice.DeviceInfo.SoftwareVersion",
                "name[4]" => "InternetGatewayDevice.DeviceInfo.HardwareVersion",
                "name[5]" => "InternetGatewayDevice.DeviceInfo.SerialNumber",
                "name[6]" => "InternetGatewayDevice.DeviceInfo.ModelName",
                "name[7]" => "InternetGatewayDevice.DeviceInfo.Manufacturer",
                "name[8]" => "InternetGatewayDevice.WANDevice.1.WANEthernetInterfaceConfig.MACAddress",
                "name[9]" => "InternetGatewayDevice.WANDevice.1.WANConnectionDevice.1.WANIPConnection.1.ExternalIPAddress",
            ]
        ]);
        $acsInfo = json_decode($response->getBody());
        return [
            "MemoryStatus" => [
                "Free" => $acsInfo[0]->{'InternetGatewayDevice.DeviceInfo.MemoryStatus'}[0]->{'InternetGatewayDevice.DeviceInfo.MemoryStatus.Free'} ?? null,
                "Total" => $acsInfo[0]->{'InternetGatewayDevice.DeviceInfo.MemoryStatus'}[1]->{'InternetGatewayDevice.DeviceInfo.MemoryStatus.Total'} ?? null,
            ],
            "CPUUsage" => $acsInfo[1]->{'InternetGatewayDevice.DeviceInfo.ProcessStatus.CPUUsage'}[0]->{'InternetGatewayDevice.DeviceInfo.ProcessStatus.CPUUsage'} ?? null,
            "UpTime" => $acsInfo[2]->{'InternetGatewayDevice.DeviceInfo.UpTime'}[0]->{'InternetGatewayDevice.DeviceInfo.UpTime'} ?? null,
            "SoftwareVersion" => $acsInfo[3]->{'InternetGatewayDevice.DeviceInfo.SoftwareVersion'}[0]->{'InternetGatewayDevice.DeviceInfo.SoftwareVersion'} ?? null,
            "HardwareVersion" => $acsInfo[4]->{'InternetGatewayDevice.DeviceInfo.HardwareVersion'}[0]->{'InternetGatewayDevice.DeviceInfo.HardwareVersion'} ?? null,
            "SerialNumber" => $acsInfo[5]->{'InternetGatewayDevice.DeviceInfo.SerialNumber'}[0]->{'InternetGatewayDevice.DeviceInfo.SerialNumber'} ?? null,
            "ModelName" => $acsInfo[6]->{'InternetGatewayDevice.DeviceInfo.ModelName'}[0]->{'InternetGatewayDevice.DeviceInfo.ModelName'} ?? null,
            "Manufacturer" => $acsInfo[7]->{'InternetGatewayDevice.DeviceInfo.Manufacturer'}[0]->{'InternetGatewayDevice.DeviceInfo.Manufacturer'} ?? null,
            "MACAddress" => $acsInfo[8]->{'InternetGatewayDevice.WANDevice.1.WANEthernetInterfaceConfig.MACAddress'}[0]->{'InternetGatewayDevice.WANDevice.1.WANEthernetInterfaceConfig.MACAddress'} ?? null,
            "IPAddress" => $acsInfo[9]->{'InternetGatewayDevice.WANDevice.1.WANConnectionDevice.1.WANIPConnection.1.ExternalIPAddress'}[0]->{'InternetGatewayDevice.WANDevice.1.WANConnectionDevice.1.WANIPConnection.1.ExternalIPAddress'} ?? null,
        ];

        $response = $this->client->request('POST', $this->api_baseUrl, [
            "verify" => false,
            "form_params" => [
                "token" => $this->apiKey,
                "device_id" => 19,
                "method" => "diagnostic",
                "host" => "8.8.8.8",
                "type" => "ping",
                "repetitions" => rand(3, 20),
            ]
        ]);

        // $response = $this->client->request('POST', $this->api_baseUrl, [
        //     "verify" => false,
        //     "form_params" => [
        //         "token" => $this->apiKey,
        //         "deviceID" => 19,
        //         "method" => "setParamsDevice",
        //         "name[0]" => "InternetGatewayDevice.IPPingDiagnostics.Host",
        //         "value[0]" => "google.ru",
        //         "type[0]" => "string",
        //         "name[1]" => "InternetGatewayDevice.IPPingDiagnostics.DiagnosticsState",
        //         "value[1]" => "Requested",
        //         "type[1]" => "string",
        //         "name[2]" => "InternetGatewayDevice.IPPingDiagnostics.NumberOfRepetitions",
        //         "value[2]" => "10",
        //         "type[2]" => "unsignedInt"
        //     ]
        // ]);

        echo "<pre>";
        print_r(json_decode($response->getBody()));

        // $response = $this->client->request('POST', $this->api_baseUrl, [
        //     "verify" => false,
        //     "form_params" => [
        //         "token" => $this->apiKey,
        //         "deviceID" => 7,
        //         "method" => "refresh",
        //     ]
        // ]);

        $taskId = json_decode($response->getBody())->result;

        $response2 = $this->client->request('POST', $this->api_baseUrl, [
            "verify" => false,
            "form_params" => [
                "token" => $this->apiKey,
                "taskId" => $taskId,
                "method" => "checkTaskStatus",
            ]
        ]);
        print_r(json_decode($response2->getBody()));
        $tries = 0;
        while (json_decode($response2->getBody())->{'Operation Status'} != 2) {
            sleep(2);
            $response2 = $this->client->request('POST', $this->api_baseUrl, [
                "verify" => false,
                "form_params" => [
                    "token" => $this->apiKey,
                    "taskId" => $taskId,
                    "method" => "checkTaskStatus",
                ]
            ]);
            print_r(json_decode($response2->getBody()));
            $tries++;
            if ($tries >= 20) exit();
        }

        $response3 = $this->client->request('POST', $this->api_baseUrl, [
            "verify" => false,
            "form_params" => [
                "token" => $this->apiKey,
                "deviceID" => 19,
                "method" => "getSelectedParam",
                "name" => "InternetGatewayDevice.IPPingDiagnostics"
            ]
        ]);
        print_r(json_decode($response3->getBody()));
    }
}
