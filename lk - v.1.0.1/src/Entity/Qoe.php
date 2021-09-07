<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use GuzzleHttp\Client;

class Qoe
{
    private $credentials_user = "elqoe";
    private $credentials_password = "!QAZ2wsx#EDC";
    private $api_baseUrl = "http://192.168.88.237/api/v1/";

    private $total_sessions;
    private $median_rtt;
    private $long_sessions;
    private $average_rtt;
    private $qoe_graph;
    private $qoe_table_data;
    private $error;

    public function __construct(Client $client, string $num_contract)
    {
        $start_date = (new \DateTime("now"))->setTimestamp(time()-(86400 * 3))->format("d.m.Y H:i");
        $end_date = (new \DateTime("now"))->format("d.m.Y H:i");
        $response = $client->request(
            'GET',
            $this->api_baseUrl . 'rtt?host=' . $num_contract . '&start_date=' . $start_date . '&end_date=' . $end_date,
            [
                'auth' => [
                    $this->credentials_user,
                    $this->credentials_password
                ],
            ]
        );
        $qoe_data = json_decode($response->getBody())->response ?? json_decode($response->getBody());
        if (isset($qoe_data->quantiles)) {
            $this->qoe_graph = [];
            $prev_quantily = 0;
            foreach ($qoe_data->quantiles as $quantily) {
                $delta_rtt = $quantily - $prev_quantily;
                if ($delta_rtt <= 0) {
                    continue;
                }
                $this->qoe_graph[] = [
                    'x' => $quantily,
                    'y' => 10 / max($delta_rtt, 1),
                ];
                $prev_quantily = $quantily;
            }
            $this->total_sessions = $qoe_data->total_sessions;
            $this->median_rtt = $qoe_data->median_rtt;
            $this->long_sessions = $qoe_data->long_sessions;
            $this->average_rtt = $qoe_data->average_rtt;
            $response = $client->request(
                'GET',
                $this->api_baseUrl . 'qoe_table?host=' . $num_contract . '&start_date=' . $start_date . '&end_date=' . $end_date,
                [
                    'auth' => [
                        $this->credentials_user,
                        $this->credentials_password
                    ],
                ]
            );
            $qoe_table_data = json_decode($response->getBody())->response ?? json_decode($response->getBody());
            if (isset($qoe_table_data[0])) {
                foreach ($qoe_table_data as &$table_data) {
                    $table_data->sample_ip = long2ip($table_data->sample_ip);
                }
                $this->qoe_table_data = $qoe_table_data;
            } else {
                $this->error = [
                    'error' => $qoe_table_data->error,
                    'message' => $qoe_table_data->message,
                ];
            }
        } else {
            $this->error = [
                'error' => $qoe_data->error,
                'message' => $qoe_data->message,
            ];
        }
        return $this;
    }

    public function getTotalSessions(): ?string
    {
        return $this->total_sessions;
    }

    public function getMedianRtt(): ?string
    {
        return $this->median_rtt;
    }

    public function getAverageRtt(): ?string
    {
        return $this->average_rtt;
    }

    public function getLongSessions(): ?string
    {
        return $this->long_sessions;
    }

    public function getQoeGraph(): ?array
    {
        return $this->qoe_graph;
    }

    public function getQoeTableData(): ?array
    {
        return $this->qoe_table_data;
    }

    public function getError(): ?array
    {
        return $this->error;
    }
}
