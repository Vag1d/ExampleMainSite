<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use GuzzleHttp\Client;
use Symfony\Component\Cache\Adapter\FilesystemAdapter;
use Symfony\Contracts\Cache\ItemInterface;

class Bitrix
{
    private $api_baseUrl = "https://192.168.117.56/rest/1/ok0c6xtu6ztgbx8t/";

    private $client;
    private $data;

    public function __construct()
    {
        $this->client = new Client([
            'base_uri' => $this->api_baseUrl,
        ]);
    }

    public function getData()
    {
        return $this->data;
    }

    public function createTask(string $num_contract)
    {
        $current_date = new \DateTime('now', new \DateTimeZone("Europe/Moscow"));
        $response = $this->client->post('tasks.task.add', [
            'verify' => false,
            'form_params' => [
                'fields' => [
                    'TITLE' => '[' . $current_date->format("d.m.Y H:i:s") . '] Абонент #' . $num_contract,
                    'RESPONSIBLE_ID' => 88,
                    'PRIORITY' => 2,
                    'DEADLINE' => $current_date->setTimestamp(time() + (86400 * 3))->format("d.m.Y H:i:s"),
                    'DESCRIPTION' => 'Сгенерировано с ЛК',
                ],
            ]
        ]);
        $this->data = [json_decode($response->getBody())->result->task];
        return $this;
    }

    public function getTasks(string $num_contract)
    {
        $response = $this->client->post('tasks.task.list', [
            'verify' => false,
            'form_params' => [
                'filter' => [
                    'TITLE' => '%' . $num_contract . '%'
                ],
                'select' => ['ID', 'TITLE', 'STATUS', 'CREATED_DATE', 'CREATED_BY', 'DEADLINE'],
                'order' => [
                    'CREATED_DATE' => 'desc'
                ]
            ]
        ]);
        $data = json_decode($response->getBody())->result->tasks;
        $this->data = !empty($data) ? $data : null;
        return $this;
    }
}
