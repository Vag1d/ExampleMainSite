<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use GuzzleHttp\Client;
use App\Entity\Bitrix;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Security\Core\Security;

/**
 * @Route("/abonent_info")
 */

class BitrixController extends AbstractController
{
    /**
     * @Route("/ajax_bitrix_tasks", methods={"POST"}, name="ajax_bitrix_tasks")
     */
    public function ajaxBitrixTasks(Request $request)
    {
        $this->get('session')->save();
        if (!$request->isXmlHttpRequest()) {
            return new JsonResponse([
                'status' => 'Error',
                'message' => 'Послан не ajax запрос!'
            ], 400);
        } else {
            $num_contract = $request->request->get('num_contract');
            $bitrix = new Bitrix();
            $bitrix->getTasks($num_contract);
            $tokenProvider = $this->container->get('security.csrf.token_manager');
            $token = $tokenProvider->getToken('bitrix-add-task' . $num_contract)->getValue();
            return new JsonResponse([
                "status" => "OK",
                "bitrix" => [
                    "tasks" => $bitrix->getData()
                ],
                "token" => $token,
            ]);
        }
    }

    /**
     * @Route("/ajax_bitrix_task_create", methods={"POST"}, name="ajax_bitrix_task_create")
     */
    public function ajaxBitrixTaskCreate(Request $request)
    {
        $this->get('session')->save();
        if (!$request->isXmlHttpRequest()) {
            return new JsonResponse([
                'status' => 'Error',
                'message' => 'Послан не ajax запрос!'
            ], 400);
        } else {
            $num_contract = $request->request->get('num_contract');
            $submittedToken = $request->request->get('token');
            if ($this->isCsrfTokenValid('bitrix-add-task' . $num_contract, $submittedToken)) {
                $generate_table = $request->request->get('generate_table');
                $bitrix = new Bitrix();
                $bitrix->createTask($num_contract);
                if ($generate_table) {
                    return new JsonResponse([
                        "status" => "OK",
                        "content" => $this->render('bitrix/_bitrix_tasks.html.twig', [
                            'bitrix' => $bitrix,
                            'num_contract' => $num_contract,
                            'generate_script' => false
                        ])->getContent(),
                    ]);
                } else {
                    $bitrix_data = $bitrix->getData()[0];
                    return new JsonResponse([
                        "status" => "OK",
                        'task' => [
                            'id' => $bitrix_data->id,
                            'createdBy' => $bitrix_data->createdBy,
                            'title' => $bitrix_data->title,
                            'createdDate' => $bitrix_data->createdDate,
                            'deadline' => $bitrix_data->deadline,
                            'status' => $bitrix_data->status
                        ],
                    ]);
                }
            }
        }
    }

    /**
     * @Route("/bitrix_test", methods={"GET"}, name="bitrix_test")
     */
    public function bitrixTest(Request $request)
    {
        $client = new Client([
            'base_uri' => "https://bitrix24.ellcom.ru/rest/39776/4yc5gryat33g5ohj/",
        ]);
        $response = $client->post('user.get', [
            'verify' => false,
            'form_params' => [
                'fields' => [
                    'LAST_NAME' => 'Ахмедилов',
                    'NAME' => 'Руслан',
                ],
            ]
        ]);
        echo "<pre>";
        print_r(json_decode($response->getBody()));
        exit();
    }
}
