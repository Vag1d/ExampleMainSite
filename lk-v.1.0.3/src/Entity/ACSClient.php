<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\ACSClientRepository")
 */
class ACSClient
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=50)
     */
    private $first_name;

    /**
     * @ORM\Column(type="string", length=50)
     */
    private $sur_name;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $address;

    /**
     * @ORM\Column(type="string", length=100, nullable=true)
     */
    private $email;

    /**
     * @ORM\Column(type="integer")
     */
    private $device_id;

    /**
     * @ORM\Column(type="string", length=50)
     */
    private $patronymic_name;

    /**
     * @ORM\Column(type="string", length=50)
     */
    private $contract_number;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\IpPingDiagnostics", mappedBy="device_id")
     */


    public function getId(): ?int
    {
        return $this->id;
    }

    public function getFirstName(): ?string
    {
        return $this->first_name;
    }

    public function setFirstName(string $first_name): self
    {
        $this->first_name = $first_name;

        return $this;
    }

    public function getSurName(): ?string
    {
        return $this->sur_name;
    }

    public function setSurName(string $sur_name): self
    {
        $this->sur_name = $sur_name;

        return $this;
    }

    public function getAddress(): ?string
    {
        return $this->address;
    }

    public function setAddress(string $address): self
    {
        $this->address = $address;

        return $this;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(?string $email): self
    {
        $this->email = $email;

        return $this;
    }

    public function getDeviceId(): ?int
    {
        return $this->device_id;
    }

    public function setStatusId(int $device_id): self
    {
        $this->device_id = $device_id;

        return $this;
    }

    public function getPatronymicName(): ?string
    {
        return $this->patronymic_name;
    }

    public function setPatronymicName(string $patronymic_name): self
    {
        $this->patronymic_name = $patronymic_name;

        return $this;
    }

    public function getContractNumber(): ?string
    {
        return $this->contract_number;
    }

    public function setContractNumber(string $contract_number): self
    {
        $this->contract_number = $contract_number;

        return $this;
    }
}
