$(document).ready(function() {
    $("#help").click(function(e){
        e.preventDefault();
        var hook_submit = $("#search-form");
        hook_submit.submit(function() {
            return false;
        });
        var tr_helper = $("#abon_list").children('tbody').children('tr').first();
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
            'next #num_contract': 'В случаях, когда по указанным параметрам находится больше одного абонента,<br>показывается список этих абонентов.',
            'nextButton': {text: "Дальше"},
            'skipButton': {text: "Пропустить"},
          },
          {
            'next #tr-helper': 'В этом списке показывается краткая сводка по абоненту. Чтобы увидеть более<br>подробную информацию, кликните на его номер договора.',
            'nextButton': {text: "Закончить"},
            'showSkip': false,
          },
        ];
        enjoyhint_instance.set(enjoyhint_script_steps);
        enjoyhint_instance.run();
    });
});
