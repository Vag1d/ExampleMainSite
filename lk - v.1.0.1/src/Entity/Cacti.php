<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use GuzzleHttp\Client;
use Symfony\Component\Cache\Adapter\FilesystemAdapter;
use Symfony\Contracts\Cache\ItemInterface;

class Cacti
{
    private $credentials_user = "pasha";
    private $credentials_password = "Exception123";
    private $api_baseUrl = "http://192.168.88.151/cacti/";

    private $data;

    public function __construct(int $graphid)
    {
        $cache = new FilesystemAdapter();
        $this->data = $cache->get('cacti_graph_' . $graphid, function (ItemInterface $item) use ($graphid) {
            $item->expiresAfter(300);

            $client = new Client([
                'base_uri' => $this->api_baseUrl,
                'cookies' => true,
            ]);
            $response = $client->get('index.php');
            $doc = new \DOMDocument();
            $doc->loadHTML($response->getBody()->getContents());
            $inputs = $doc->getElementsByTagName("input");
            foreach ($inputs as $input) {
                if ($input->getAttribute("name") === "__csrf_magic") {
                    $csrf_token = $input->getAttribute("value");
                    break;
                }
            }
            $response = $client->post('index.php', [
                'form_params' => [
                    'login_username' => $this->credentials_user,
                    'login_password' => $this->credentials_password,
                    'action' => 'login',
                    '__csrf_magic' => $csrf_token
                ]
            ]);

            return json_decode($client->get('graph_json.php', [
                'query' => [
                    'local_graph_id' => $graphid,
                ],
            ])->getBody()->getContents());
        });
    }

    public function getData()
    {
        return $this->data;
    }
}
