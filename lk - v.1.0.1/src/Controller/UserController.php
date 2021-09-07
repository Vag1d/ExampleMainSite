<?php

namespace App\Controller;

use App\Entity\User;
use App\Form\UserType;
use App\Repository\UserRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;
use Symfony\Component\Security\Core\Security;

/**
 * @Route("/user")
 */
class UserController extends AbstractController
{
    /**
     * @Route("/", name="user_index", methods="GET")
     */
    public function index(UserRepository $userRepository): Response
    {
        $users = $userRepository->findAll();
        // foreach ($users as &$user) {
        //     foreach ($user->getRoles() as &$role) {
        //         switch ($role) {
        //             case "ROLE_USER":
        //                 $role = "Пользователь";
        //                 break;
        //             case "ROLE_SUPER_ADMIN":
        //                 $role = "Разработчик";
        //                 break;
        //             case "ROLE_ADMIN":
        //                 $role = "Администратор";
        //                 break;
        //             case "ROLE_CALLCENTER":
        //                 $role = "Call-центр";
        //                 break;
        //             case "ROLE_ENGINEER":
        //                 $role = "Инженер";
        //                 break;
        //         }
        //     }
        // }
        // echo "<pre>"; dd($users); exit();
        return $this->render('user/index.html.twig', ['users' => $users]);
    }

    /**
     * @Route("/new", name="user_new", methods="GET|POST")
     */
    public function new(Request $request, UserPasswordEncoderInterface $encoder): Response
    {
        $user = new User();
        $form = $this->createForm(UserType::class, $user);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $data = $request->request->all();
            $encoded = $encoder->encodePassword($user, $data['user']['password']);

            $user->setPassword($encoded);

            $em = $this->getDoctrine()->getManager();
            $em->persist($user);
            $em->flush();

            return $this->redirectToRoute('user_index');
        }

        return $this->render('user/new.html.twig', [
            'user' => $user,
            'form' => $form->createView(),
        ]);
    }

    /**
     * @Route("/{id}", name="user_show", methods="GET", requirements={"id"="\d+"})
     */
    public function show(User $user): Response
    {
        return $this->render('user/show.html.twig', ['user' => $user]);
    }

    /**
     * @Route("/{id}/edit", name="user_edit", methods="GET|POST", requirements={"id"="\d+"})
     */
    public function edit(Request $request, User $user, UserPasswordEncoderInterface $encoder): Response
    {
        $em = $this->getDoctrine()->getManager();
        $form = $this->createForm(UserType::class, $user);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {

            $data = $request->request->all(); // In this case, we can not use: $data = $form->getData();

            if(!empty($data['user']['password'])){
                $encoded = $encoder->encodePassword($user, $data['user']['password']);
                $user->setPassword($encoded);
                $em->persist($user);
            }

            $em->flush();
            return $this->redirectToRoute('user_index');
        }

        return $this->render('user/edit.html.twig', [
            'user' => $user,
            'form' => $form->createView(),
        ]);
    }


    /**
     * @Route("/self_edit", name="self_edit", methods="GET|POST")
     */
    public function selfEdit(Request $request, Security $security, UserPasswordEncoderInterface $encoder): Response
    {
        $em = $this->getDoctrine()->getManager();
        $user = $security->getUser();
        $username = $user->getUsername();
        $roles = $user->getRoles();
        $form = $this->createForm(UserType::class, $user);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $data = $request->request->all(); // In this case, we can not use: $data = $form->getData();
            $user->setUsername($username);
            $user->setRoles($roles);
            if (!empty($data['user']['password'])) {
                $encoded = $encoder->encodePassword($user, $data['user']['password']);
                $user->setPassword($encoded);
                $em->persist($user);
            }
            $em->flush();
            return $this->redirectToRoute('index');
        }

        return $this->render('user/settings.html.twig', [
            'user' => $user,
            'form' => $form->createView(),
        ]);
    }

    /**
     * @Route("/{id}", name="user_delete", methods="DELETE", requirements={"id"="\d+"})
     */
    public function delete(Request $request, User $user): Response
    {
        if ($this->isCsrfTokenValid('delete'.$user->getId(), $request->request->get('_token'))) {
            $em = $this->getDoctrine()->getManager();
            $em->remove($user);
            $em->flush();
        }

        return $this->redirectToRoute('user_index');
    }

    /**
     * @Route("/get_billing_token", name="get_billing_token", methods="GET")
     */
    public function getBillingToken(Request $request, Security $security): Response
    {
        $token = $request->query->get('token');
        $redirect = $request->query->get('redirect');
        if ($token !== null) {
            $em = $this->getDoctrine()->getManager();
            $user = $security->getUser();
            $user->setBillingToken($token);
            $em->persist($user);
            $em->flush();
            return $this->redirectToRoute($redirect ?? 'self_edit');
        } else {
            return $this->redirectToRoute('index');
        }
    }
}
