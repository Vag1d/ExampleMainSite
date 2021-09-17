<?php

namespace App\Message;

class ACSTask
{
    private $deviceId;
    private $hostToCheck;
    private $operation;

    public function __construct(?int $deviceId, ?string $hostToCheck, ?string $operation)
    {
        $this->deviceId = $deviceId;
        $this->hostToCheck = $hostToCheck;
        $this->operation = $operation;
        print_r(get_class_methods($this));
    }

    public function getDeviceId(): ?int
    {
        return $this->deviceId;
    }

    public function getHostToCheck(): ?string
    {
        return $this->hostToCheck;
    }

    public function getOperation(): ?string
    {
        return $this->operation;
    }
}
