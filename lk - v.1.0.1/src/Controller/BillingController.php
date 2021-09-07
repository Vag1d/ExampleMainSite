<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use GuzzleHttp\Client;
use App\Entity\Billing;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Security\Core\Security;

/**
 * @Route("/abonent_info")
 */

class BillingController extends AbstractController
{
    /**
     * @Route("/ajax_billing", methods={"POST"}, name="ajax_billing")
     */
    public function ajaxBilling(Request $request, Security $security)
    {
        $this->get('session')->save();
        if (!$request->isXmlHttpRequest()) {
            return new JsonResponse([
                'status' => 'Error',
                'message' => 'Послан не ajax запрос!'
            ], 400);
        } else {
            $num_contract = $request->request->get('num_contract');
            if (!empty($num_contract)) {
                $client = new Client();
                $billing_info = new Billing();
                $granted = $security->isGranted('ROLE_BILLING_AUTH');
                $token = $granted ? $security->getUser()->getBillingToken() : null;
                if (preg_match("/^\d{9}$/", $num_contract)) {
                    $result = $billing_info->getContractByTitle($client, $num_contract, !$granted, $token);
                } else {
                    $result = $billing_info->getContractByLogin($client, $num_contract, !$granted, $token);
                }
                if ($result === "token_error") {
                    return new JsonResponse([
                        "status" => "token_error",
                        'not_found' => true,
                    ]);
                } elseif ($billing_info->getTitle() !== null) {
                    return new JsonResponse([
                        "status" => "OK",
                        "billing" => [
                            "id" => $billing_info->getId(),
                            "title" => $billing_info->getTitle(),
                            "comment" => $billing_info->getComment(),
                            "balance" => $billing_info->getBalance(),
                            "agent" => $billing_info->getAgent(),
                            "tariffList" => $billing_info->getTariffList(),
                            "inetServiceList" => $billing_info->getInetServiceList(),
                            "status" => $billing_info->getStatus(),
                            "statusDate" => $billing_info->getStatusDate(),
                            "phoneList" => $billing_info->getPhoneList(),
                            "operator" => $billing_info->getOperator(),
                            "limit" => $billing_info->getLimit(),
                            "unlockSumm" => $billing_info->getUnlockSumm(),
                        ],
                    ]);
                } else {
                    return new JsonResponse([
                        'status' => 'OK',
                        'not_found' => true,
                    ]);
                }
            } else {
                return new JsonResponse([
                    'status' => 'OK',
                    'content' => $this->render('billing/_billing_info.html.twig', ['error' => 'Введите номер договора'])->getContent()
                ]);
            }
        }
    }

    /**
     * @Route("/ajax_billing_sessions", methods={"POST"}, name="ajax_billing_sessions")
     */
    public function ajaxBillingSessions(Request $request)
    {
        $this->get('session')->save();
        if (!$request->isXmlHttpRequest()) {
            return new JsonResponse([
                'status' => 'Error',
                'message' => 'Послан не ajax запрос!'
            ], 400);
        } else {
            $client = new Client();
            $billing_info = new Billing();
            $sessionsList = $billing_info->getSessionsList($client, $request->request->get('contractId'), $request->request->get('serviceIds'));
            return new JsonResponse([
                'status' => 'OK',
                'sessionsList' => $sessionsList
            ]);
        }
    }

    /**
     * @Route("/ajax_billing_active_session", methods={"POST"}, name="ajax_billing_active_session")
     */
    public function ajaxBillingActiveSession(Request $request)
    {
        $this->get('session')->save();
        if (!$request->isXmlHttpRequest()) {
            return new JsonResponse([
                'status' => 'Error',
                'message' => 'Послан не ajax запрос!'
            ], 400);
        } else {
            $client = new Client();
            $billing_info = new Billing();
            $activeSession = $billing_info->getActiveSession($client, $request->request->get('contractId'), $request->request->get('serviceIds'));
            return new JsonResponse([
                'status' => 'OK',
                'activeSession' => $activeSession
            ]);
        }
    }

    /**
     * @Route("/ajax_billing_add_phone", methods={"POST"}, name="ajax_billing_add_phone")
     */
    public function ajaxBillingAddPhone(Request $request)
    {
        $this->get('session')->save();
        if (!$request->isXmlHttpRequest()) {
            return new JsonResponse([
                'status' => 'Error',
                'message' => 'Послан не ajax запрос!'
            ], 400);
        } else {
            $client = new Client();
            $billing_info = new Billing();
            $phoneAdd = $billing_info->addPhoneNumberToContract($client, $request->request->get('contractId'), $request->request->get('phoneNumber'));
            return new JsonResponse([
                'status' => 'OK',
                'phoneAdd' => $phoneAdd
            ]);
        }
    }

    /**
     * @Route("/ajax_check_billing_access", methods={"POST"}, name="ajax_check_billing_access")
     */
    public function ajaxCheckAccess(Request $request, Security $security)
    {
        $this->get('session')->save();
        if (!$request->isXmlHttpRequest()) {
            return new JsonResponse([
                'status' => 'Error',
                'message' => 'Послан не ajax запрос!'
            ], 400);
        } else {
            $client = new Client();
            $billing = new Billing();
            return new JsonResponse([
                'status' => 'OK',
                'access' => $billing->checkAccess($client, $security->getUser()->getBillingToken()),
            ]);
        }
    }
}
