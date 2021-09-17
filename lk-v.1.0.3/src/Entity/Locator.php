<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use GuzzleHttp\Client;


class Locator
{

    private $api_baseUrl = "https://192.168.117.25/api/LokatorValues/";

    private $device_ip;
    private $deviceName;
    private $manufacturer;
    private $model;
    private $okato;
    private $serial_number;
    private $firmware;
    private $cpu;
    private $uptime;
    private $ports_info;

    public function __construct(Client $client, string $ip)
    {
        try {
            $response = $client->request('GET', $this->api_baseUrl . str_replace(".", "_", $ip), ['timeout' => 180.]);
        } catch (\GuzzleHttp\Exception\RequestException $e) {
            $this->device_ip = $e->getMessage();
            return;
        }

        $locator_info = json_decode($response->getBody())[0] ?? null;

        if ($locator_info !== null) {
            $this->device_ip = $locator_info->Dev_IPAddress;
            $this->okato = $locator_info->Dev_OKATO;
            $this->serial_number = $locator_info->DeviceSerialNumber;
            $this->deviceName = $locator_info->Dev_Name;
            $this->manufacturer = $locator_info->ManufacturerDev;
            $this->model = $locator_info->ModelOfDevice;
            $this->firmware = $locator_info->Dev_Firmware;
            $this->cpu = $locator_info->CPU_Load;
            $this->uptime = $locator_info->Up_Time;
            $this->ports_info = $locator_info->PortsInfo;
            return $this;
        } else {
            return false;
        }
    }


    public function getDeviceIp(): ?string
    {
        return $this->device_ip;
    }

    public function getOkato(): ?string
    {
        return $this->okato;
    }

    public function getSerialNumber(): ?string
    {
        return $this->serial_number;
    }

    public function getDeviceName(): ?string
    {
        return $this->deviceName;
    }

    public function getManufacturer(): ?string
    {
        return $this->manufacturer;
    }
    public function getModel(): ?string
    {
        return $this->model;
    }

    public function getFirmware(): ?string
    {
        return $this->firmware;
    }

    public function getCpu(): ?string
    {
        return $this->cpu;
    }

    public function getUptime(): ?string
    {
        return $this->uptime;
    }

    public function getPortsInfo(): ?array
    {
        return $this->ports_info;
    }
}
