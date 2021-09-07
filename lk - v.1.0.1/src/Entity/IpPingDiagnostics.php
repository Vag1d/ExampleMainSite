<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\IpPingDiagnosticsRepository")
 */
class IpPingDiagnostics
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
    private $sent;

    /**
     * @ORM\Column(type="string", length=45, nullable=true)
     */
    private $received;

    /**
     * @ORM\Column(type="string", length=45, nullable=true)
     */
    private $lost;

    /**
     * @ORM\Column(type="string", length=45, nullable=true)
     */
    private $minimum;

    /**
     * @ORM\Column(type="string", length=45, nullable=true)
     */
    private $maximum;

    /**
     * @ORM\Column(type="string", length=45, nullable=true)
     */
    private $average;

    /**
     * @ORM\Column(type="integer", nullable=true)
     */
    private $device_id;

    /**
     * @ORM\Column(type="integer", nullable=true)
     */
    private $type;

    /**
     * @ORM\Column(type="integer", nullable=true)
     */
    private $num_index;

    /**
     * @ORM\Column(type="datetime", nullable=true)
     */
    private $create_date;

    /**
     * @ORM\Column(type="text", nullable=true)
     */
    private $IPPingDiagnostics;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getSent(): ?string
    {
        return $this->sent;
    }

    public function setSent(?string $sent): self
    {
        $this->sent = $sent;

        return $this;
    }

    public function getReceived(): ?string
    {
        return $this->received;
    }

    public function setReceived(?string $received): self
    {
        $this->received = $received;

        return $this;
    }

    public function getLost(): ?string
    {
        return $this->lost;
    }

    public function setLost(?string $lost): self
    {
        $this->lost = $lost;

        return $this;
    }

    public function getMinimum(): ?string
    {
        return $this->minimum;
    }

    public function setMinimum(?string $minimum): self
    {
        $this->minimum = $minimum;

        return $this;
    }

    public function getMaximum(): ?string
    {
        return $this->maximum;
    }

    public function setMaximum(?string $maximum): self
    {
        $this->maximum = $maximum;

        return $this;
    }

    public function getAverage(): ?string
    {
        return $this->average;
    }

    public function setAverage(?string $average): self
    {
        $this->average = $average;

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

    public function getType(): ?int
    {
        return $this->type;
    }

    public function setType(?int $type): self
    {
        $this->type = $type;

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

    public function getCreateDate(): ?\DateTimeInterface
    {
        return $this->create_date;
    }

    public function setCreateDate(?\DateTimeInterface $create_date): self
    {
        $this->create_date = $create_date;

        return $this;
    }

    public function getIPPingDiagnostics(): ?string
    {
        return $this->IPPingDiagnostics;
    }

    public function setIPPingDiagnostics(?string $IPPingDiagnostics): self
    {
        $this->IPPingDiagnostics = $IPPingDiagnostics;

        return $this;
    }
}
