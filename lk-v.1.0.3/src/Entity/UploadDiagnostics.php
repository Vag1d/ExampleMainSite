<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\UploadDiagnosticsRepository")
 */
class UploadDiagnostics
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="integer", nullable=true)
     */
    private $device_id;

    /**
     * @ORM\Column(type="string", length=45, nullable=true)
     */
    private $rom_time;

    /**
     * @ORM\Column(type="string", length=45, nullable=true)
     */
    private $bom_time;

    /**
     * @ORM\Column(type="string", length=45, nullable=true)
     */
    private $eom_time;

    /**
     * @ORM\Column(type="integer", nullable=true)
     */
    private $test_file_length;

    /**
     * @ORM\Column(type="integer", nullable=true)
     */
    private $total_bytes_sent;

    /**
     * @ORM\Column(type="string", length=45, nullable=true)
     */
    private $tcp_open_request_time;

    /**
     * @ORM\Column(type="string", length=45, nullable=true)
     */
    private $tcp_open_response_time;

    /**
     * @ORM\Column(type="integer", nullable=true)
     */
    private $num_index;

    /**
     * @ORM\Column(type="integer", nullable=true)
     */
    private $type;

    /**
     * @ORM\Column(type="datetime", nullable=true)
     */
    private $create_date;

    public function getId(): ?int
    {
        return $this->id;
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

    public function getRomTime(): ?string
    {
        return $this->rom_time;
    }

    public function setRomTime(?string $rom_time): self
    {
        $this->rom_time = $rom_time;

        return $this;
    }

    public function getBomTime(): ?string
    {
        return $this->bom_time;
    }

    public function setBomTime(?string $bom_time): self
    {
        $this->bom_time = $bom_time;

        return $this;
    }

    public function getEomTime(): ?string
    {
        return $this->eom_time;
    }

    public function setEomTime(?string $eom_time): self
    {
        $this->eom_time = $eom_time;

        return $this;
    }

    public function getTestFileLength(): ?int
    {
        return $this->test_file_length;
    }

    public function setTestFileLength(?int $test_file_length): self
    {
        $this->test_file_length = $test_file_length;

        return $this;
    }

    public function getTotalBytesSent(): ?int
    {
        return $this->total_bytes_sent;
    }

    public function setTotalBytesSent(?int $total_bytes_sent): self
    {
        $this->total_bytes_sent = $total_bytes_sent;

        return $this;
    }

    public function getTcpOpenRequestTime(): ?string
    {
        return $this->tcp_open_request_time;
    }

    public function setTcpOpenRequestTime(?string $tcp_open_request_time): self
    {
        $this->tcp_open_request_time = $tcp_open_request_time;

        return $this;
    }

    public function getTcpOpenResponseTime(): ?string
    {
        return $this->tcp_open_response_time;
    }

    public function setTcpOpenResponseTime(?string $tcp_open_response_time): self
    {
        $this->tcp_open_response_time = $tcp_open_response_time;

        return $this;
    }

    public function getNumIndex(): ?int
    {
        return $this->num_index;
    }

    public function setNumIndex(?int $num_index): self
    {
        $this->num_index = $num_index;

        return $this;
    }

    public function getType(): ?int
    {
        return $this->type;
    }

    public function setType(?int $type): self
    {
        $this->type = $type;

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
}
