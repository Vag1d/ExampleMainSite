<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use kamermans\ZabbixClient\ZabbixClient;
use GuzzleHttp\Client;
use Symfony\Component\Cache\Adapter\FilesystemAdapter;
use Symfony\Contracts\Cache\ItemInterface;

class Zabbix
{
    private $credentials_user = "dinalt";
    private $credentials_password = "12qwaszx";
    private $api_baseUrl = "http://77.232.161.34/";

    private $hostid;
    private $maps;
    private $ocato;
    private $interfaces;
    private $items;

    public function __construct(string $ocato)
    {
        $this->ocato = $ocato;

        $client = new ZabbixClient(
            $this->api_baseUrl . 'api_jsonrpc.php',
            $this->credentials_user,
            $this->credentials_password
        );

        $response = $client->request('host.get', [
            "search" => [
                "host" => [
                    $this->ocato
                ]
            ],
        ]);
        $this->hostid = $response[0]['hostid'];
        $response = $client->request('hostinterface.get', [
            "hostids" => $this->hostid
        ]);
        $this->interfaces = $response->getResult();
        $response = $client->request('item.get', [
            "hostids" => $this->hostid
        ]);
        $items = $response->getResult();
        $graph_client = new Client([
            'base_uri' => $this->api_baseUrl,
            'cookies' => true,
        ]);
        $graph_client->post('index.php', [
            'form_params' => [
                'name' => $this->credentials_user,
                'password' => $this->credentials_password,
                'enter' => 'Sign in',
            ],
        ]);
        $start_time = (new \DateTime())->setTimestamp(time() - (86400 * 7));
        foreach ($items as &$item) {
            if ($item['name'] === 'Host status') {
                $stime = $start_time->getTimestamp();
                $period = time() - $start_time->getTimestamp();
                $graph = $graph_client->get('chart.php', [
                    'query' => [
                        'itemids[0]' => $item['itemid'],
                        'width' => 621,
                        'height' => 100,
                        'stime' => $stime,
                        'period' => $period,
                    ],
                ])->getBody()->getContents();
                $this->items['host_status']['lastvalue'] = $item['lastvalue'];
                $this->items['host_status']['graphdata'] = base64_encode($graph);
                $this->items['host_status']['stime'] = $stime;
                $this->items['host_status']['period'] = $period;
                $this->items['host_status']['itemid'] = $item['itemid'];
            } elseif ($item['name'] === 'Delay to Host') {
                $this->items['delay']['lastvalue'] = $item['lastvalue'];
            }
        }
        $cache = new FilesystemAdapter();
        $maps = $cache->get('zabbix_maps', function (ItemInterface $item) use ($client) {
            $item->expiresAfter(3600);
            $response = $client->request('map.get', [
                "output" => "extend",
                "selectSelements" => "extend",
            ]);
            return $response->getResult();
        });

        $search_maps = [];
        foreach ($maps as &$map) {
            foreach ($map['selements'] as &$selement) {
                if ($selement['elementid'] === $this->hostid) {
                    $search_maps[] = [
                        'name' => $map['name'],
                        'selementid' => $selement['selementid'],
                        'sysmapid' => $map['sysmapid']
                    ];
                    break;
                }
            }
        }

        $this->maps = $search_maps;
    }

    public function getMaps(): ?Array
    {
        return $this->maps;
    }

    public function getOcato(): ?String
    {
        return $this->ocato;
    }

    public function getInterfaces(): ?Array
    {
        return $this->interfaces;
    }

    public function getItems(): ?Array
    {
        return $this->items;
    }

    public function getHostid()
    {
        return $this->hostid;
    }
}
