<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use GuzzleHttp\Client;

class Billing
{
    private $credentials_user = "subscriberCard";
    private $credentials_password = "0KXMw9ie29UMy43MDMqUhZ1k";
    private $defaultToken = "iRrki-8Ca7nJ-xABfzPdXg";
    private $api_baseUrl = "https://bill.ellco.ru/bgbilling/executer/json/ru.ellco.bgbilling.subscriber/SubscriberService";

    private $id;
    private $title;
    private $comment;
    private $balance;
    private $agent;
    private $status;
    private $statusDate;
    private $tariffList;
    private $inetServiceList;
    private $abonList;
    private $phoneList;
    private $operator;
    private $limit;
    private $unlockSumm;

    public function getContractById(Client $client, int $id, bool $granted = true, ?string $token = null)
    {
        $response = $client->request(
            "POST",
            $this->api_baseUrl,
            [
                'body' => '{
                    "method": "getContractById",
                    "user": {
                        "user": "' . $this->credentials_user .'",
                        "pswd": "' . $this->credentials_password . '"
                    },
                    "params": {
                        "contractId": ' . $id . ',
                        "token": "' . (($granted) ? $this->defaultToken : $token) . '"
                    }
                }'
            ]
        );
        $billing_info = json_decode($response->getBody())->data->return ?? [];
        $this->id = $billing_info->id;
        $this->title = $billing_info->title;
        $this->comment = $billing_info->comment;
        $this->balance = $billing_info->balance;
        $this->agent = $billing_info->agent;
        $this->tariffList = $billing_info->tariffList;
        $this->inetServiceList = $billing_info->inetServiceList;
        $this->status = $billing_info->status;
        $this->statusDate = $billing_info->statusDate;
        $this->phoneList = $billing_info->phoneList;
        $this->operator = $billing_info->operator;
        $this->limit = $billing_info->limit;
        $this->unlockSumm = $billing_info->unlockSumm;
        return $this;
    }

    public function getContractByTitle(Client $client, string $num_contract, bool $granted = true, ?string $token = null)
    {
        $response = $client->request(
            "POST",
            $this->api_baseUrl,
            [
                'body' => '{
                    "method": "contractListByTitle",
                    "user": {
                        "user": "' . $this->credentials_user .'",
                        "pswd": "' . $this->credentials_password . '"
                    },
                    "params": {
                        "title": "' . $num_contract . '",
                        "token": "' . (($granted) ? $this->defaultToken : $token) . '"
                    }
                }'
            ]
        );

        $billingData = json_decode($response->getBody());
        $billingID = $billingData->data->return[0]->id ?? null;

        if ($billingData->status === "error" && $billingData->message === "Wrong token") {
            return "token_error";
        } elseif ($billingID !== null) {
            return $this->getContractById($client, $billingID, $granted, $token);
        } else {
            return false;
        }
    }

    public function getContractByLogin(Client $client, string $login, bool $granted = true, ?string $token = null)
    {
        $response = $client->request(
            "POST",
            $this->api_baseUrl,
            [
                'body' => '{
                    "method": "contractListByLogin",
                    "user": {
                        "user": "' . $this->credentials_user .'",
                        "pswd": "' . $this->credentials_password . '"
                    },
                    "params": {
                        "login": "' . $login .'",
                        "token": "' . (($granted) ? $this->defaultToken : $token) . '"
                    }
                }'
            ]
        );

        $billingData = json_decode($response->getBody());
        $billingID = $billingData->data->return[0]->id ?? null;

        if ($billingData->status === "error" && $billingData->message === "Wrong token") {
            return "token_error";
        } elseif ($billingID !== null) {
            return $this->getContractById($client, $billingID, $granted, $token);
        } else {
            return false;
        }
    }

    public function getContractByIdentifier(Client $client, string $ocato, string $port = "%", bool $granted = true, ?string $token = null)
    {
        $response = $client->request(
            "POST",
            $this->api_baseUrl,
            [
                'body' => '{
                    "method": "contractListByIdentifier",
                    "user": {
                        "user": "' . $this->credentials_user .'",
                        "pswd": "' . $this->credentials_password . '"
                    },
                    "params": {
                        "agentRemoteId": "' . $ocato .'",
                        "agentCircuitId" : "' . $port . '",
                        "token": "' . (($granted) ? $this->defaultToken : $token) . '"
                    }
                }'
            ]
        );

        $billingData = json_decode($response->getBody());
        $this->abonList = $billingData->data->return ?? [];

        if ($billingData->status === "error" && $billingData->message === "Wrong token") {
            return "token_error";
        } else {
            return true;
        }
    }

    public function getContractByComment(Client $client, string $comment, bool $granted = true, ?string $token = null)
    {
        $response = $client->request(
            "POST",
            $this->api_baseUrl,
            [
                'body' => '{
                    "method": "contractListByComment",
                    "user": {
                        "user": "' . $this->credentials_user .'",
                        "pswd": "' . $this->credentials_password . '"
                    },
                    "params": {
                        "comment": "' . $comment .'",
                        "token": "' . (($granted) ? $this->defaultToken : $token) . '"
                    }
                }'
            ]
        );

        $billingData = json_decode($response->getBody());
        $this->abonList = $billingData->data->return ?? [];

        if ($billingData->status === "error" && $billingData->message === "Wrong token") {
            return "token_error";
        } else {
            return true;
        }
    }

    public function getContractByPhone(Client $client, string $phone, bool $granted = true, ?string $token = null)
    {
        $response = $client->request(
            "POST",
            $this->api_baseUrl,
            [
                'body' => '{
                    "method": "contractListByPhone",
                    "user": {
                        "user": "' . $this->credentials_user .'",
                        "pswd": "' . $this->credentials_password . '"
                    },
                    "params": {
                        "phone": "' . $phone .'",
                        "token": "' . (($granted) ? $this->defaultToken : $token) . '"
                    }
                }'
            ]
        );

        $billingData = json_decode($response->getBody());
        $this->abonList = $billingData->data->return ?? [];

        if ($billingData->status === "error" && $billingData->message === "Wrong token") {
            return "token_error";
        } else {
            return true;
        }
    }

    public function getSessionsList(Client $client, $contractId, $serviceIds)
    {
        $aliveList = [];
        $logList = [];
        foreach ($serviceIds as $serviceId) {
            $response = $client->request(
                "POST",
                $this->api_baseUrl,
                [
                    'body' => '{
                        "method": "getInetSessionAliveList",
                        "user": {
                            "user": "' . $this->credentials_user .'",
                            "pswd": "' . $this->credentials_password . '"
                        },
                        "params": {
                            "contractId": ' . $contractId .',
                            "servId": ' . $serviceId . '
                        }
                    }'
                ]
            );
            $data = json_decode($response->getBody())->data->return ?? null;
            foreach ($data as $session) {
                $aliveList[] = $session;
            }
            $response = $client->request(
                "POST",
                $this->api_baseUrl,
                [
                    'body' => '{
                        "method": "getInetSessionLogList",
                        "user": {
                            "user": "' . $this->credentials_user .'",
                            "pswd": "' . $this->credentials_password . '"
                        },
                        "params": {
                            "contractId": ' . $contractId .',
                            "servId": ' . $serviceId . '
                        }
                    }'
                ]
            );
            $data = json_decode($response->getBody())->data->return ?? null;
            foreach ($data as $session) {
                $logList[] = $session;
            }
        }

        return [
            "aliveList" => $aliveList,
            "logList" => $logList,
        ];
    }

    public function getActiveSession(Client $client, $contractId, $serviceIds)
    {
        $sessionsList = [];
        foreach ($serviceIds as $serviceId) {
            $response = $client->request(
                "POST",
                $this->api_baseUrl,
                [
                    'body' => '{
                        "method": "getInetSessionAliveList",
                        "user": {
                            "user": "' . $this->credentials_user .'",
                            "pswd": "' . $this->credentials_password . '"
                        },
                        "params": {
                            "contractId": ' . $contractId .',
                            "servId": ' . $serviceId . '
                        }
                    }'
                ]
            );
            $data = json_decode($response->getBody())->data->return ?? null;
            if ($data !== null && count($data)) {
                return $data[0];
            }
        }

        return null;
    }

    public function addPhoneNumberToContract(Client $client, $contractId, $phoneNumber)
    {
        $response = $client->request(
            "POST",
            $this->api_baseUrl,
            [
                'body' => '{
                    "method": "addPhoneNumberToContract",
                    "user": {
                        "user": "' . $this->credentials_user .'",
                        "pswd": "' . $this->credentials_password . '"
                    },
                    "params": {
                        "contractId": ' . $contractId .',
                        "phone": "' . $phoneNumber . '"
                    }
                }'
            ]
        );
        $data = json_decode($response->getBody())->status ?? null;
        if ($data !== null && $data === 'ok') {
            return true;
        } else {
            return false;
        }
    }

    public function checkAccess(Client $client, string $token)
    {
        $response = $client->request(
            "POST",
            $this->api_baseUrl,
            [
                'body' => '{
                    "method": "contractListByTitle",
                    "user": {
                        "user": "' . $this->credentials_user .'",
                        "pswd": "' . $this->credentials_password . '"
                    },
                    "params": {
                        "title": "123456789",
                        "token": "' . $token . '"
                    }
                }'
            ]
        );

        $billingData = json_decode($response->getBody());
        return !($billingData->status === "error" && $billingData->message === "Wrong token");
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTitle(): ?string
    {
        return $this->title;
    }

    public function getComment(): ?string
    {
        return $this->comment;
    }

    public function getBalance(): ?string
    {
        return $this->balance;
    }

    public function getAgent(): ?string
    {
        return $this->agent;
    }

    public function getStatus(): ?string
    {
        return $this->status;
    }

    public function getStatusDate(): ?string
    {
        return $this->statusDate;
    }

    public function getTariffList(): ?array
    {
        return $this->tariffList;
    }

    public function getInetServiceList(): ?array
    {
        return $this->inetServiceList;
    }

    public function getAbonList(): ?array
    {
        return $this->abonList;
    }

    public function getPhoneList(): ?array
    {
        return $this->phoneList;
    }

    public function getOperator(): ?string
    {
        return $this->operator;
    }

    public function getLimit(): ?string
    {
        return $this->limit;
    }

    public function getUnlockSumm(): ?string
    {
        return $this->unlockSumm;
    }
}
