<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use App\Entity\Client;
use Symfony\Component\Process\Process;
use Symfony\Component\Process\Exception\ProcessFailedException;

class MainController extends AbstractController
{
    /**
     * @Route("/main", name="main")
     */
    public function index()
    {
        $client = new \GuzzleHttp\Client();
        $response = $client->request('GET', 'http://192.168.88.237/api/v1/qoe_table?host=101007590',[
                'auth' => [
                    'elqoe',
                    '!QAZ2wsx#EDC'
                ],
            ]
        );

        $res = json_decode($response->getBody());
        echo '<pre>';
//        print_r ($res);
        echo '</pre>';

        $name = 'QoE';
        return $this->render('main/index.html.twig', [
            'controller_name' => $name,
        ]);
    }

    public function table()
    {
        return $this->render('table/table.html.twig');
    }

    /**
     * @Route("/oktell", name="oktell")
     */
    public function oktell()
    {
        $client = new \GuzzleHttp\Client();
        $response = $client->request('GET', 'http://10.17.124.10:4055/getversion',[
                'auth' => [
                    'artur',
                    'Qwerty!35'
                ],
            ]
        );

        $res = json_decode($response->getBody());
        echo '<pre>';
        print_r($res);
        echo '</pre>';
        return $this->render('table/test_table.html.twig');
    }
}
