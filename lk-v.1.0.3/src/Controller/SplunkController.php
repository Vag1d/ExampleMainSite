<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;

class SplunkController extends AbstractController
{
    /**
     * @Route("/splunk", name="splunk")
     */
    public function index()
    {
        $client = new \GuzzleHttp\Client();
        $response = $client->request('GET', 'http://192.168.88.237/api/v1/rtt',[
                'auth' => [
                    'elqoe',
                    '!QAZ2wsx#EDC'
                ],
            ]
        );

        $res = json_decode($response->getBody());
        print_r ($res);
        
        $name = 'Splunk';
        return $this->render('splunk/index.html.twig', [
            'controller_name' => $name,
        ]);
    }
}
