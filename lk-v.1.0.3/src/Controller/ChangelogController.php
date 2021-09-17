<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;

class ChangelogController extends AbstractController
{
    /**
     * @Route("/changelogs", name="changelogs")
     */
    public function index()
    {
        return $this->render('changelog/index.html.twig');
    }
}
