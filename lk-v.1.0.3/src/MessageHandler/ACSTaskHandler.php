<?php

namespace App\MessageHandler;

use App\Message\ACSTask;
use Symfony\Component\Messenger\Handler\MessageHandlerInterface;
use Symfony\Component\Process\Process;
use Symfony\Component\Process\Exception\ProcessFailedException;

class ACSTaskHandler implements MessageHandlerInterface
{
    public function __invoke(ACSTask $acsTask)
    {
        echo "Start\n";
        sleep(5);
        // $process = new Process([
        //     "ssh", "-o", "StrictHostKeyChecking=no",
        //     "-i", "/var/www/.ssh/id_rsa", "artur@192.168.89.77",
        //     "./GetACSInfo.sh -" . $acsTask->getOperation() . " -test_addr ". $acsTask->getHostToCheck() ." -dev_id ". $acsTask->getDeviceId() .""
        // ]);
        // $process->run();
        // echo $process->getOutput();
        echo "\nEnd\n";
    }
}
