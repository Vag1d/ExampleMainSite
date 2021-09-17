<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\TraceRouteDiagnosticsRepository")
 */
class TraceRouteDiagnostics
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=45, nullable=true)
     */
    private $response_time;

    /**
     * @ORM\Column(type="string", length=45, nullable=true)
     */
    private $route_hops_number_of_entries;

    /**
     * @ORM\Column(type="integer", nullable=true)
     */
    private $device_id;

    /**
     * @ORM\Column(type="datetime", nullable=true)
     */
    private $create_date;

    /**
     * @ORM\Column(type="string", length=45, nullable=true)
     */
    private $TraceRouteDiagnostics;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getResponseTime(): ?string
    {
        return $this->response_time;
    }

    public function setResponseTime(?string $response_time): string
    {
        $this->response_time = $response_time;

        return $this;
    }

    public function getRouteHopsNumberOfEntries(): ?string
    {
        return $this->route_hops_number_of_entries;
    }

    public function setRouteHopsNumberOfEntries(?string $route_hops_number_of_entries): self
    {
        $this->route_hops_number_of_entries = $route_hops_number_of_entries;

        return $this;
    }

    public function getDeviceId(): ?int
    {
        return $this->device_id;
    }

    public function setDeviceId(?int $device_id): self
    {
        $this->device_id = $device_id;

        return $this;
    }

    public function getCreateDate(): ?\DateTimeInterface
    {
        return $this->create_date;
    }

    public function setCreateDate(?\DateTimeInterface $create_date): self
    {
        $this->create_date = $create_date;

        return $this;
    }

    public function getTraceRouteDiagnostics(): ?string
    {
        return $this->TraceRouteDiagnostics;
    }

    public function setTraceRouteDiagnostics(?string $TraceRouteDiagnostics): self
    {
        $this->TraceRouteDiagnostics = $TraceRouteDiagnostics;

        return $this;
    }
}
