<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Core\Security;
use App\Entity\Billing;
use GuzzleHttp\Client;
use App\Entity\User;
use App\Form\UserType;
use App\Repository\UserRepository;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;
use App\Entity\SearchHistory;

/**
 * @Route("/abonent_info")
 */

class AbonentController extends AbstractController
{
    /**
     * @Route("/", methods={"GET", "POST"}, name="abon_index")
     */
    public function index(Request $request, Security $security)
    {
        $this->get('session')->save();
        // echo "<pre>"; print_r(unserialize($this->get('session')->get('_security_main'))); exit();
        if (!empty($request->request->get('num_contract'))) {
            $num_contract = $request->request->get('num_contract');
        } elseif (!empty($request->query->get('num_contract'))) {
            $num_contract = $request->query->get('num_contract');
        }

        if (isset($num_contract)) {
            $num_contract = trim($num_contract);
            $search = new SearchHistory();
            $search->setInitiator($security->getUser());
            $search->setSearchObject($num_contract);
            $search->setTime(new \DateTime());
            $em = $this->getDoctrine()->getManager();
            $em->persist($search);
            $em->flush();
            $granted = $security->isGranted('ROLE_BILLING_AUTH');
            $token = $granted ? $security->getUser()->getBillingToken() : null;
            if (preg_match("/^\d{9}$/", $num_contract)) {
                return $this->render('aboninfo/index.html.twig', [
                    'num_contract' => $num_contract,
                ]);
            } elseif (preg_match("/^(?<ocato>\d{3}\.\d{3}\.\d{3}\.\d{3})((:(?<port>\d+))?)$/", $num_contract, $ocato_port)) {
                $client = new Client();
                $billing_info = new Billing();
                $result = $billing_info->getContractByIdentifier($client, $ocato_port['ocato'], $ocato_port['port'] ?? '%', !$granted, $token);
                if ($result === "token_error") {
                    return $this->render('aboninfo/index.html.twig', [
                        'num_contract' => $num_contract,
                        'token_error' => true
                    ]);
                } elseif (count($billing_info->getAbonList()) == 1) {
                    $abonent = $billing_info->getContractById($client, $billing_info->getAbonList()[0]->id, !$granted, $token);
                    return $this->render('aboninfo/index.html.twig', [
                        'num_contract' => $num_contract,
                        'abonent' => [
                            "id" => $billing_info->getId(),
                            "title" => $abonent->getTitle(),
                            "comment" => $abonent->getComment(),
                            "balance" => $abonent->getBalance(),
                            "agent" => $abonent->getAgent(),
                            "tariffList" => $abonent->getTariffList(),
                            "inetServiceList" => $abonent->getInetServiceList(),
                            "status" => $abonent->getStatus(),
                            "statusDate" => $abonent->getStatusDate(),
                            "phoneList" => $billing_info->getPhoneList(),
                            "operator" => $billing_info->getOperator(),
                            "limit" => $billing_info->getLimit(),
                            "unlockSumm" => $billing_info->getUnlockSumm(),
                        ],
                    ]);
                } else {
                    return $this->render('aboninfo/abon_list.html.twig', [
                        'abonList' => $billing_info->getAbonList(),
                        'num_contract' => $num_contract
                    ]);
                }
            } elseif (preg_match("/^[а-я\s\.]{4,}$/iu", $num_contract)) {
                if (preg_match("/^(?<fio>[а-я]+(\s+[а-я]+(\s+[а-я]+)?)?)$/iu", preg_replace("/\s{2,}/u", " ", $num_contract), $fio)) {
                    $client = new Client();
                    $billing_info = new Billing();
                    $result = $billing_info->getContractByComment($client, $fio['fio'], !$granted, $token);
                    if ($result === "token_error") {
                        return $this->render('aboninfo/index.html.twig', [
                            'num_contract' => $num_contract,
                            'token_error' => true
                        ]);
                    } elseif (count($billing_info->getAbonList()) == 1) {
                        $abonent = $billing_info->getContractById($client, $billing_info->getAbonList()[0]->id, !$granted, $token);
                        return $this->render('aboninfo/index.html.twig', [
                            'num_contract' => $num_contract,
                            'abonent' => [
                                "id" => $billing_info->getId(),
                                "title" => $abonent->getTitle(),
                                "comment" => $abonent->getComment(),
                                "balance" => $abonent->getBalance(),
                                "agent" => $abonent->getAgent(),
                                "tariffList" => $abonent->getTariffList(),
                                "inetServiceList" => $abonent->getInetServiceList(),
                                "status" => $abonent->getStatus(),
                                "statusDate" => $abonent->getStatusDate(),
                                "phoneList" => $billing_info->getPhoneList(),
                                "operator" => $billing_info->getOperator(),
                                "limit" => $billing_info->getLimit(),
                                "unlockSumm" => $billing_info->getUnlockSumm(),
                            ],
                        ]);
                    } else {
                        return $this->render('aboninfo/abon_list.html.twig', [
                            'abonList' => $billing_info->getAbonList(),
                            'num_contract' => $num_contract
                        ]);
                    }
                } else {

                }
                // elseif (preg_match("/^(?<fio>[а-я]+(\s(?<i>[а-я])(\s|\.)(?<o>[а-я])(\s|\.)))$/iu", $num_contract, $fio)) {
                //     echo "<pre>";
                //     print_r($fio);
                //     exit();
                // }
            } elseif (preg_match("/^([78]9\d{9})|(\d{6})$/", $num_contract, $phone)) {
                $client = new Client();
                $billing_info = new Billing();
                $result = $billing_info->getContractByPhone($client, $phone[0], !$granted, $token);
                if ($result === "token_error") {
                    return $this->render('aboninfo/index.html.twig', [
                        'num_contract' => $num_contract,
                        'token_error' => true
                    ]);
                } elseif (count($billing_info->getAbonList()) == 1) {
                    $abonent = $billing_info->getContractById($client, $billing_info->getAbonList()[0]->id, !$granted, $token);
                    return $this->render('aboninfo/index.html.twig', [
                        'num_contract' => $num_contract,
                        'abonent' => [
                            "id" => $billing_info->getId(),
                            "title" => $abonent->getTitle(),
                            "comment" => $abonent->getComment(),
                            "balance" => $abonent->getBalance(),
                            "agent" => $abonent->getAgent(),
                            "tariffList" => $abonent->getTariffList(),
                            "inetServiceList" => $abonent->getInetServiceList(),
                            "status" => $abonent->getStatus(),
                            "statusDate" => $abonent->getStatusDate(),
                            "phoneList" => $billing_info->getPhoneList(),
                            "operator" => $billing_info->getOperator(),
                            "limit" => $billing_info->getLimit(),
                            "unlockSumm" => $billing_info->getUnlockSumm(),
                        ],
                    ]);
                } else {
                    return $this->render('aboninfo/abon_list.html.twig', [
                        'abonList' => $billing_info->getAbonList(),
                        'num_contract' => $num_contract
                    ]);
                }
            } else {
                return $this->render('aboninfo/index.html.twig', [
                    'num_contract' => $num_contract,
                ]);
            }
        } else {
            $searchHistory = $this->getDoctrine()
                ->getRepository(SearchHistory::class)
                ->findBy([
                    "initiator" => $security->getUser()
                ], [
                    "time" => "DESC"
                ], 20);
            return $this->render('aboninfo/index.html.twig', [
                'num_contract' => null,
                'searchHistory' => $searchHistory
            ]);
        }
    }
}
