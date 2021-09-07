<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use GuzzleHttp\Client;
use App\Entity\Cacti;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Security\Core\Security;

/**
 * @Route("/abonent_info")
 */

class CactiController extends AbstractController
{
    /**
     * @Route("/ajax_cacti", methods={"POST"}, name="ajax_cacti")
     */
    public function ajaxCacti(Request $request)
    {
        $this->get('session')->save();
        if (!$request->isXmlHttpRequest()) {
            return new JsonResponse([
                'status' => 'Error',
                'message' => 'Послан не ajax запрос!'
            ], 400);
        } else {
            $graphid = $request->request->get('graphid');
            $cacti = new Cacti($graphid);
            return new JsonResponse([
                "status" => "OK",
                "content" => $this->render('cacti/_cacti_graph.html.twig', [
                    'cacti' => $cacti,
                ])->getContent(),
            ]);
        }
    }
}
