$(document).ready(function() {
    $("#help").click(function(e) {
        e.preventDefault();
        var hook_submit = $("#search-form");
        hook_submit.submit(function() {
            return false;
        });
        var hook_links = $(".links-helper");
        hook_links.click(function(e) {
            e.preventDefault();
            return false;
        });
        var info_helper = $("#headingAbonent").parent();
        info_helper.attr('id', 'info_helper');
        var comments_helper = $("#headingComments").parent();
        comments_helper.attr('id', 'comments_helper');
        var acs_helper = $("#headingACS").parent();
        acs_helper.attr('id', 'acs_helper');
        var current_tab = $("#collapseACS").find('ul').find('.active');
        var enjoyhint_instance = new EnjoyHint({
            'onSkip': function () {
                hook_submit.off();
                hook_links.off();
                info_helper.removeAttr('id');
                comments_helper.removeAttr('id');
                setTimeout(() => $("body").removeAttr('style'), 50);
            },
            'onEnd': function () {
                hook_submit.off();
                hook_links.off();
                info_helper.removeAttr('id');
                comments_helper.removeAttr('id');
                setTimeout(() => $("body").removeAttr('style'), 50);
            },
        });
        var enjoyhint_script_steps = [
          {
            'next .sidebar-header': 'Этот инструктаж поможет вам освоиться со страницей текущего состояния абонента.',
            'nextButton': {text: "Дальше"},
            'skipButton': {text: "Пропустить"},
          },
          {
            'next #num_contract': 'Здесь ранее вы вводили данные абонента. Если нужно совершить<br>поиск снова, смело вводите новые данные прямо в это поле.',
            'nextButton': {text: "Дальше"},
            'skipButton': {text: "Пропустить"},
            'timeout': 200,
          },
          {
            'next #info_helper': 'В этом блоке распологается информация об абоненте. Данные приходят из систем Биллинга, QoE и Zabbix.',
            'nextButton': {text: "Дальше"},
            'skipButton': {text: "Пропустить"},
          },
          {
            'next #billing_balance': 'Некоторые поля в этом и других блоках имеют индикацию из 3 уровней:<br><i class="fas fa-circle text-success"></i> - все хорошо<br><i class="fas fa-circle text-warning"></i> - есть проблемы<br><i class="fas fa-circle text-danger"></i> - худший случай<br>По ним можно узнать что у абонента не в порядке.<br>В заголовке подсвечивается наихудший уровень проблемы.',
            'nextButton': {text: "Дальше"},
            'skipButton': {text: "Пропустить"},
          },
          {
            'next #session_helper': 'Также в некоторых полях имеется возможность открыть окно с более подробной информацией.',
            'nextButton': {text: "Дальше"},
            'skipButton': {text: "Пропустить"},
          },
          {
            'next #comments_helper': 'В этом блоке можно оставлять пометки об абоненте.',
            'nextButton': {text: "Дальше"},
            'skipButton': {text: "Пропустить"},
          },
          {
            'next #acs_helper': 'Этот блок содержит несколько разделов.<br>На вкладке <em>Доступность хоста</em> - график с <em>Zabbix\'а</em>, показывающий состояние хоста, за последние 3 дня.<br>Кликнув по нему, можно перейти к этому графику в <em>Zabbix\'e</em>.',
            'nextButton': {text: "Дальше"},
            'skipButton': {text: "Пропустить"},
            onBeforeStart: function() {
                $("#zabbix_graph_tab")[0].click();
            }
          },
          {
            'next #collapseACS': 'На вкладке <em>Locator</em> - данные с <em>Locator\'а</em>, включая порт абонента, полученный из <em>Биллинга</em>.',
            'nextButton': {text: "Дальше"},
            'skipButton': {text: "Пропустить"},
            'timeout': 100,
            onBeforeStart: function() {
                $("#locator_tab")[0].click();
            }
          },
        ];
        if (!$("#acs_info_tab").is(":hidden")) {
            enjoyhint_script_steps.push({
                'next #collapseACS': 'Следующие 4 вкладки появляются только в том случае,<br>когда у абонента имеется ACS устройство.<br>На вкладке <em>CPE абонента</em> - общие данные его маршрутизатора<br>и состояние последних 5 задач на устройстве.',
                'nextButton': {text: "Дальше"},
                'skipButton': {text: "Пропустить"},
                'timeout': 100,
                onBeforeStart: function() {
                    $("#acs_info_tab")[0].click();
                }
            });
            enjoyhint_script_steps.push({
                'next #collapseACS': '<br>На вкладках <em>Ping</em>, <em>Трассировка</em> и <em>Скорость</em><br>можно посмотреть соответствующие замеры и добавлять задачи для новых.',
                'nextButton': {text: "Дальше"},
                'skipButton': {text: "Пропустить"},
                'timeout': 100,
                onBeforeStart: function() {
                    $("#acs_pings_tab")[0].click();
                }
            });
        }
        enjoyhint_script_steps.push({
          'next #help': 'Вот и все! Если вновь возникнут вопросы по интерфейсу,<br>вы всегда можете обратиться за помощью к этому инструктажу.<br>Приятного использования :)',
          'nextButton': {text: "Завершить"},
          'showSkip': false,
          'timeout': 100,
          onBeforeStart: function() {
              current_tab[0].click();
          }
        });
        enjoyhint_instance.set(enjoyhint_script_steps);
        enjoyhint_instance.run();
    });
});
