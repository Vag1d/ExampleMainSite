<?php

namespace App\Form;

use App\Entity\User;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\PasswordType;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\Extension\Core\Type\CollectionType;

class UserType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('username', TextType::class, [
                'label' => "Имя пользователя",
            ])
            ->add('password', PasswordType::class, [
                'required'   => false,
                'help' => "Оставьте поле пустым, чтобы его не менять",
                'label' => "Пароль"
            ]);

        $builder->add('roles', ChoiceType::class, [
                       'multiple' => true,
                       'expanded' => true,
                       'choices' => [
                           'Разработчик'       => 'ROLE_SUPER_ADMIN',
                           'Администратор'     => 'ROLE_ADMIN',
                           'Пользователь'      => 'ROLE_USER',
                           'Call-центр'        => 'ROLE_CALLCENTER',
                           'Инженер'           => 'ROLE_ENGINEER',
                           'Нужно авторизоваться в Биллинге'     => 'ROLE_BILLING_AUTH',
                       ],
                       'label' => 'Роли'
                   ]);
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'data_class' => User::class,
        ]);
    }
}
