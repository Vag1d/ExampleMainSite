<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\TestRepository")
 */
class Test
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $text;

    /**
     * @ORM\Column(type="integer")
     */
    private $number;

    /**
     * @ORM\Column(type="datetime", nullable=true)
     */
    private $datetime;

    /**
     * @ORM\Column(type="float", nullable=true)
     */
    private $field;

    /**
     * @ORM\Column(type="datetimetz")
     */
    private $datetimetz;

    public function __construct() {
	$this->datetimetz = new \DateTime();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getText(): ?string
    {
        return $this->text;
    }

    public function setText(string $text): self
    {
        $this->text = $text;

        return $this;
    }

    public function getNumber(): ?int
    {
        return $this->number;
    }

    public function setNumber(int $number): self
    {
        $this->number = $number;

        return $this;
    }

    public function getDatetime(): ?\DateTimeInterface
    {
        return $this->datetime;
    }

    public function setDatetime(?\DateTimeInterface $datetime): self
    {
        $this->datetime = $datetime;

        return $this;
    }

    public function getField(): ?float
    {
        return $this->field;
    }

    public function setField(?float $field): self
    {
        $this->field = $field;

        return $this;
    }

    public function getDatetimetz(): ?\DateTimeInterface
    {
        return $this->datetimetz;
    }

    public function setDatetimetz(\DateTimeInterface $datetimetz): self
    {
        $this->datetimetz = $datetimetz;

        return $this;
    }
}
