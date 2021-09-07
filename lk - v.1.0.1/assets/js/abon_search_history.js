$(document).ready(function() {
    $("#help").click(function(e){
        e.preventDefault();
        var hook_submit = $("#search-form");
        hook_submit.submit(function() {
            return false;
        });
        var tr_helper = $("#search_history").children('tbody').children('tr').first();
        tr_helper.attr('id', 'tr-helper');
        var enjoyhint_instance = new EnjoyHint({
            'onSkip': function () {
                hook_submit.off();
                tr_helper.removeAttr('id');
            },
            'onEnd': function () {
                hook_submit.off();
                tr_helper.removeAttr('id');
            },
        });
        var enjoyhint_script_steps = [
          {
            'next .sidebar-header': 'Добро пожаловать в Карточку абонента!<br>Этот небольшой инструктаж поможет вам освоиться с интерфейсом данного приложения.',
            'nextButton': {text: "Дальше"},
            'skipButton': {text: "Пропустить"},
          },
          {
            'next #tr-helper': 'Здесь располагается история ваших попыток поиска.<br>Показываются последние 20 записей<br>и отсюда можно быстро перейти<br>к ранее просмотренной странице.',
            'nextButton': {text: "Дальше"},
            'skipButton': {text: "Пропустить"},
          },
          {
            'click #num_contract': 'Введите информацию для поиска абонентов. Поиск можно<br>осуществлять по множеству параметров:<ul><li>Номер договора</li><li>PPPoE логин абонента</li><li>Окато или окато:порт</li><li>ФИО абонента</li><li>А также контактный номер</li></ul>Тип указанного параметра определяется автоматически.<br>Введите информацию и нажмите кнопку "<em>Искать</em>" справа от поля<br>или клавишу <em>Enter</em> на клавиатуре.',
            'showNext': false,
            'skipButton': {text: "Пропустить"},
            'timeout': 200,
          },
        ];
        enjoyhint_instance.set(enjoyhint_script_steps);
        enjoyhint_instance.run();
    });
});
