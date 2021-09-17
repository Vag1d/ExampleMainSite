<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Entity\Comment;
use App\Repository\CommentRepository;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\Serializer\Serializer;
use Symfony\Component\Serializer\Encoder\JsonEncoder;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;

/**
 * @Route("/abonent_info")
 */

class CommentsController extends AbstractController
{
    /**
     * @Route("/ajax_comments", methods={"POST"}, name="ajax_comments")
     */
    public function ajaxComments(Request $request, CommentRepository $comments_repository, Security $security)
    {
        $user = $security->getUser();
        $this->get('session')->save();
        if (!$request->isXmlHttpRequest()) {
            return new JsonResponse([
                'status' => 'Error',
                'message' => 'Послан не ajax запрос!'
            ], 400);
        } else {
            $num_contract = $request->request->get('num_contract');
            $offset = $request->request->get('offset') ?? 0;
            $comments = $comments_repository->findBy([
                'num_contract' => $num_contract
            ], [
                'createdAt' => 'DESC'
            ], 6, $offset);
            $normalizer = new ObjectNormalizer();
            $normalizer->setIgnoredAttributes(array('comments', 'timezone', 'password', 'roles', 'billingToken'));
            $encoder = new JsonEncoder();

            $serializer = new Serializer(array($normalizer), array($encoder));

            $tokenProvider = $this->container->get('security.csrf.token_manager');
            $token = $tokenProvider->getToken('add-comment' . $num_contract)->getValue();

            foreach ($comments as &$comment) {
                $comment->generateToken($tokenProvider, $num_contract);
            }

            return new JsonResponse([
                "status" => "OK",
                "comments" => $serializer->serialize($comments, 'json'),
                "user" => $serializer->serialize($user, 'json'),
                "token" => $token,
                "is_admin" => $security->isGranted('ROLE_ADMIN'),
            ]);
        }
    }

    /**
     * @Route("/ajax_comment_add", methods={"POST"}, name="ajax_comment_add")
     */
    public function ajaxCommentAdd(Request $request, Security $security)
    {
        $this->get('session')->save();
        if (!$request->isXmlHttpRequest()) {
            return new JsonResponse([
                'status' => 'Error',
                'message' => 'Послан не ajax запрос!'
            ], 400);
        } else {
            $submittedToken = $request->request->get('token');
            $num_contract = $request->request->get('num_contract');
            if ($this->isCsrfTokenValid('add-comment' . $num_contract, $submittedToken)) {
                $text = $request->request->get('comment');
                $comment = new Comment();
                $comment->setText($text);
                $user = $security->getUser();
                $comment->setAuthor($user);
                $comment->setNumContract($num_contract);
                $em = $this->getDoctrine()->getManager();
                $em->persist($comment);
                $em->flush();
                $normalizer = new ObjectNormalizer();
                $normalizer->setIgnoredAttributes(array('comments', 'timezone', 'password', 'roles'));
                $encoder = new JsonEncoder();

                $serializer = new Serializer(array($normalizer), array($encoder));

                $tokenProvider = $this->container->get('security.csrf.token_manager');
                $comment->generateToken($tokenProvider, $num_contract);
                return new JsonResponse([
                    "status" => "OK",
                    "comment" => $serializer->serialize($comment, 'json'),
                    "user" => $serializer->serialize($user, 'json'),
                    "is_admin" => $security->isGranted('ROLE_ADMIN'),
                ]);
            }
        }
        return new JsonResponse([
            'status' => 'Error',
            'message' => 'Неверное значение токена!'
        ], 400);
    }

    /**
     * @Route("/ajax_comment_remove", methods={"DELETE"}, name="ajax_comment_remove")
     */
    public function ajaxCommentDelete(Request $request, Security $security, CommentRepository $comments_repository)
    {
        $this->get('session')->save();
        if (!$request->isXmlHttpRequest()) {
            return new JsonResponse([
                'status' => 'Error',
                'message' => 'Послан не ajax запрос!'
            ], 400);
        } else {
            $submittedToken = $request->request->get('token');
            $num_contract = $request->request->get('num_contract');
            $comment_id = $request->request->get('comment_id');
            if ($this->isCsrfTokenValid('remove-comment' . $comment_id . $num_contract, $submittedToken)) {
                $comment = $comments_repository->find($comment_id);
                $em = $this->getDoctrine()->getManager();
                $em->remove($comment);
                $em->flush();
                return new JsonResponse([
                    "status" => "OK",
                    "confirm" => true,
                ]);
            } else {
                $submittedToken = $request->request->get('token');
                $num_contract = $request->request->get('num_contract');
                $comment_id = $request->request->get('comment_id');
                $tokenProvider = $this->container->get('security.csrf.token_manager');
                $token = $tokenProvider->getToken('remove-comment' . $comment_id . $num_contract)->getValue();
                return new JsonResponse([
                    "status" => "OK",
                    "message" => "Token sended: " . $submittedToken . ", token needed: " . $token,
                ]);
            }
        }
    }

    /**
         * @Route("/ajax_comment_edit", methods={"POST"}, name="ajax_comment_edit")
     */
    public function ajaxCommentEdit(Request $request, Security $security, CommentRepository $comments_repository)
    {
        $this->get('session')->save();
        if (!$request->isXmlHttpRequest()) {
            return new JsonResponse([
                'status' => 'Error',
                'message' => 'Послан не ajax запрос!'
            ], 400);
        } else {
            $submittedToken = $request->request->get('token');
            $num_contract = $request->request->get('num_contract');
            $comment_id = $request->request->get('comment_id');
            $text = $request->request->get('text');
            $comment = $comments_repository->find($comment_id);
            $comment->setText($text);
            $comment->setUpdatedAt(new \DateTime());
            $user = $security->getUser();
            $comment->setEditor($user);
            $em = $this->getDoctrine()->getManager();
            $em->persist($user);
            $em->flush();
            $normalizer = new ObjectNormalizer();
            $normalizer->setIgnoredAttributes(array('comments', 'timezone', 'password', 'roles'));
            $encoder = new JsonEncoder();

            $serializer = new Serializer(array($normalizer), array($encoder));

            $tokenProvider = $this->container->get('security.csrf.token_manager');
            $comment->generateToken($tokenProvider, $num_contract);
            return new JsonResponse([
                "status" => "OK",
                "confirm" => true,
                "comment" => $serializer->serialize($comment, 'json'),
            ]);
        }
    }
}
