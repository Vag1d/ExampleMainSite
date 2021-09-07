import '../css/global.scss';

const $ = require('jquery');
global.$ = global.jQuery = $;

require('bootstrap');
// import bootstrap from 'bootstrap';
// global.bootstrap = bootstrap;
require('@fortawesome/fontawesome-free/js/all.js');

import autosize from 'autosize';
global.autosize = autosize;

import ApexCharts from 'apexcharts';
global.ApexCharts = ApexCharts;

import Cookies from 'js-cookie';
global.Cookies = Cookies;

global.moment = require('moment');
global.datetimepicker = require('tempusdominus-bootstrap-4');
// import 'fullcalendar';
// import 'moment-timezone';

import 'kinetic';
import 'enjoyhint/jquery.enjoyhint';
import EnjoyHint from 'enjoyhint';
global.EnjoyHint = EnjoyHint;

window.blockHighlight = function(selector, warning_level)
{
    var warning_css = "";
    switch (warning_level) {
        case 1: warning_css = "text-warning"; break;
        case 2: warning_css = "text-danger"; break;
    }
    if (warning_level > 0) {
        if (selector.has('svg').length > 0) {
            selector.children('svg').removeClass('text-warning text-danger').addClass(warning_css);
        } else if (selector.has('i').length > 0) {
            selector.children('i').removeClass('text-warning text-danger').addClass(warning_css);
        } else {
            selector.prepend("<i class='fas fa-circle " + warning_css + "'></i> ");
        }
    }
}

window.scrollToElement = function (selector, parent = null)
{
    if (parent !== null && parent.parent().parent().next().is(":hidden")) {
        parent.click();
    }
    selector.click();
    $('html, body').animate({
        scrollTop: selector.offset().top
    }, 1000);
}

window.hexToBase64 = function(str) {
    return btoa(String.fromCharCode.apply(null, str.replace(/\r|\n/g, "").replace(/([\da-fA-F]{2}) ?/g, "0x$1 ").replace(/ +$/, "").split(" ")));
}

window.isEmpty = function(text)
{
    return text === undefined || typeof(text) === 'undefined' || text === null || text.length === 0;
}

String.prototype.toDate = function(format)
{
  var normalized      = this.replace(/[^a-zA-Z0-9]/g, '-');
  var normalizedFormat= format.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-');
  var formatItems     = normalizedFormat.split('-');
  var dateItems       = normalized.split('-');

  var monthIndex  = formatItems.indexOf("mm");
  var dayIndex    = formatItems.indexOf("dd");
  var yearIndex   = formatItems.indexOf("yyyy");
  var hourIndex     = formatItems.indexOf("hh");
  var minutesIndex  = formatItems.indexOf("ii");
  var secondsIndex  = formatItems.indexOf("ss");

  var today = new Date();

  var year  = yearIndex>-1  ? dateItems[yearIndex]    : today.getFullYear();
  var month = monthIndex>-1 ? dateItems[monthIndex]-1 : today.getMonth()-1;
  var day   = dayIndex>-1   ? dateItems[dayIndex]     : today.getDate();

  var hour    = hourIndex>-1      ? dateItems[hourIndex]    : today.getHours();
  var minute  = minutesIndex>-1   ? dateItems[minutesIndex] : today.getMinutes();
  var second  = secondsIndex>-1   ? dateItems[secondsIndex] : today.getSeconds();

  return new Date(year,month,day,hour,minute,second);
};

window.addField = function(tbody, header, id, max_columns, ajax_image, html_data = '')
{
    var colCount = tbody.children('tr').last().children('td').length;
    if (colCount !== 1) {
        tbody.append('<tr></tr>');
    }
    tbody.children('tr').last().append('<th>' + header + '</th><td id="' + id + '"><img src="' + ajax_image + '"> ' + html_data + '</td>');
}

window.endTable = function(tbody)
{
    var colCount = tbody.children('tr').last().children('td').length;
    if (colCount === 1) {
        tbody.children('tr').last().append('<th></th><td></td>');
    }
}

window.setField = function(selector, text, html = false)
{
    if(isEmpty(text)) {
        //<i class="fas fa-circle text-warning"></i>
        text = '?';
        html = true;
    }
    if (html) {
        selector.html(text);
    } else {
        selector.text(text);
    }
}

window.createAlert = function(text, style = 'warning')
{
    return $('<div class="alert alert-' + style + ' alert-dismissible fade show" role="alert">' + text + '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button></div>');
}

window.loadService = function(url, data, successCallback, failCallback = function(jqXHR, exception){})
{
    $.ajax({
        type: "POST",
        url: url,
        data: data
    })
    .done(function(data) {
        if (typeof data.status != "undefined" && data.status != "undefined")
        {
            successCallback(data);
        }
    })
    .fail(function(jqXHR, exception) {
        failCallback(jqXHR, exception);
    });
};

window.loadBilling = function (url, num_contract, successCallback, failCallback = function(jqXHR, exception){}, billingData = null)
{
    if (billingData === "null") {
        loadService(url, {"num_contract" : num_contract}, successCallback, failCallback);
    } else {
        successCallback({"status": "OK", "billing": $.parseJSON(billingData)});
    }
}

window.reportError = function(report_path, jqXHR, exception, service = null)
{
    $.ajax({
        type: "POST",
        url: report_path,
        data: {
            "statusCode": jqXHR.statusCode,
            "statusText": jqXHR.statusText,
            "exception": exception,
            "service": service,
        }
    });
}

window.generateError = function(report_path, jqXHR, exception, service = null)
{
    var msg;
    if (jqXHR.status === 0) {
        msg = "<strong>Нет соединения. Проверьте состояние вашей сети.</strong>";
    } else if (jqXHR.status === 404) {
        msg = "<strong>Один из запрашиваемых сервисов не найден.</strong> По этой причине часть данных не может быть загружена.";
    } else if (jqXHR.status === 500) {
        msg = "<strong>При запросе одного из сервисов произошла ошибка на сервере.</strong> По этой причине часть данных не может быть загружена.";
    } else if (exception === 'parsererror') {
        msg = "<strong>Ошибка в аргументах запроса.</strong> По этой причине часть данных не может быть загружена.";
    } else if (exception === 'timeout') {
        msg = "<strong>Превышено время ожидания запроса.</strong> По этой причине часть данных не может быть загружена.";
    } else if (exception === 'abort') {
        msg = "<strong>Загрузка сервиса прервана.</strong> По этой причине часть данных не может быть загружена.";
    } else {
        msg = "<strong>Неизвестная ошибка.</strong> По этой причине часть данных не может быть загружена.";
    }
    reportError(report_path, jqXHR, exception, service);
    return msg;
}

window.disableLink = function(selector, disabled = true) {
    if (disabled) {
        selector.attr("temp_href", selector.attr("href")).removeAttr("href");
    } else {
        selector.attr("href", selector.attr("temp_href")).removeAttr("temp_href");
    }
}

window.makeTableRow = function(tr_attributes, ...rows)
{
    var html = "<tr";
    if (!isEmpty(tr_attributes)) {
        $.each(tr_attributes, function(index, value) {
            html += " " + index + "='" + value + "'";
        });
    }
    html += ">";
    rows.forEach((row, index) => {
        if (isEmpty(row.show) || row.show) {
            html += "<td";
            if (!isEmpty(row.attributes)) {
                $.each(row.attributes, function(index, value) {
                    html += " " + index + "='" + value + "'";
                });
            }
            html += ">" + (!isEmpty(row.data) ? row.data : "") + "</td>";
        }
    });
    html += "</tr>";
    return html;
}

window.makeBitrixRow = function(task, count, warningBitrixLevel)
{
    var style;
    if (count > 2) {
        style = "display:none;";
        $('#bitrix_tasks_more').parent().show();
    } else {
        style = "";
    }
    var status = "";
    var warningTaskLevel = 0;
    switch (parseInt(task.status)) {
        case 1: status = "Новая"; break;
        case 2: status = "Ждет выполнения"; warningTaskLevel = 1; break;
        case 3: status = "Выполняется"; warningTaskLevel = 1; break;
        case 4: status = "Предположительно завершена"; break;
        case 5: status = "Завершена"; break;
        case 6: status = "Отложена"; warningTaskLevel = 1; break;
        case 7: status = "Отказался"; break;
    }
    switch (parseInt(task.subStatus)) {
        case -1: status += " (просрочена)"; warningTaskLevel = 2; break;
        case -2: status += " (не просмотрена)"; break;
        case -3: status += " (почти просрочена)"; break;
    }
    var color_indicator = "success";
    if (warningTaskLevel === 2) {
        color_indicator = "danger";
        warningBitrixLevel = Math.max(warningBitrixLevel, 2);
    } else if (warningTaskLevel === 1) {
        color_indicator = "warning";
        warningBitrixLevel = Math.max(warningBitrixLevel, 1);
    }
    return [
        makeTableRow(
            {style: style},
            {data: task.id},
            {data: "<a href='https://192.168.117.56/company/personal/user/" + task.createdBy + "/tasks/task/view/" + task.id + "/' target='_blank'>" + task.title + "</a>"},
            {data: new Date(task.createdDate).toLocaleString()}, {data: (task.deadline !== null ? new Date(task.deadline).toLocaleString() : "Не указан")},
            {data: "<i class='fas fa-circle text-" + color_indicator + "'></i> " + status}),
        warningBitrixLevel];
}

window.makeBitrixTable = function(bitrix_object)
{
    var bitrix_html;
    var count = 0;
    var warningBitrixLevel = 0;
    $.each(bitrix_object.tasks, function(index, task) {
        var html;
        [html, warningBitrixLevel] = makeBitrixRow(task, count, warningBitrixLevel);
        bitrix_html += html;
        count++;
    });
    $('#bitrix_tasks').html(bitrix_html);
    blockHighlight($('#bitrixInfoHeader'), warningBitrixLevel);
}

window.addBitrixRow = function(task) {
    var warningTaskLevel = 0;
    var bitrix_html;
    [bitrix_html, warningTaskLevel] = makeBitrixRow(task, 0, warningTaskLevel);
    // if ($('#bitrix_tasks_more').attr('showed') === undefined || $('#bitrix_tasks_more').attr('showed') === 'false') {
    //     $('#bitrix_tasks').children('tr:visible').last().hide();
    // }
    $('#bitrix_tasks').prepend(bitrix_html);
    // TODO: доработать, когда битрикс будет работать
    blockHighlight($('#bitrixInfoHeader'), warningBitrixLevel);
}

window.makeCommentRow = function(comment, is_admin = false) {
    return makeTableRow(
        {comment_id: comment.id, token: comment.token},
        {data: new Date(comment.createdAt.timestamp * 1000).toLocaleString()},
        {data: comment.author.username},
        {data: comment.text + (comment.editor !== null ? " <span class='edit-tooltip' data-toggle='tooltip' data-html='true' data-placement='top' title='<em>Отредактировано " + new Date(comment.updatedAt.timestamp * 1000).toLocaleString() + " пользователем " + comment.editor.username + ".</em>'><i class='fas fa-pencil-alt'></i></span>" : "")},
        {data: "<a href='#' class='comment_edit'>Редактировать</a> | <a href='#' class='comment_remove'>Удалить</a>", show: is_admin},
        {data: "<div class='form-group' align='center'><textarea class='form-control'>" + comment.text + "</textarea><button type='button' class='btn btn-primary m-2 comment_change'>Изменить</button><button type='button' class='btn btn-secondary m-2 comment_change_cancel'>Отмена</button></div>", attributes: {colspan: 4, style: 'display:none;'}, show: is_admin}
    );
}

window.makeCommentTable = function(comments, is_admin)
{
    var comments_html;
    var count = 0;
    $.each(comments, function (index, comment) {
        if (count < 5) {
            comments_html += makeCommentRow(comment, is_admin);
        } else {

        }
        count++;
    });
    $('#comments_list').html(comments_html);
    $('#comments_list .edit-tooltip').tooltip({ boundary: 'window' });
    if (is_admin) {
        $('#comments_list').parent().children('thead').children('tr').append("<th></th>");
    }
    if (count > 5) {
        $('#comments_more').parent().show();
    }
}

window.appendCommentTable = function(comments, is_admin)
{
    var comments_html;
    var count = 0;
    $.each(comments, function (index, comment) {
        if (count < 5) {
            comments_html += makeCommentRow(comment, is_admin);
        } else {

        }
        count++;
    });
    $('#comments_list').append(comments_html);
    $('#comments_list .edit-tooltip').tooltip();
    return count;
}

window.prependComment = function(comment, is_admin)
{
    var comments_html = makeCommentRow(comment, is_admin);
    $('#comments_list').prepend(comments_html);
    $('#comments_list .edit-tooltip').tooltip();
}

window.updateComment = function(comment, row, is_admin)
{
    var comment_html = makeCommentRow(comment, is_admin);
    row.after(comment_html);
    row.remove();
    $('#comments_list .edit-tooltip').tooltip();
}

window.makeAcsActivitiesRow = function(activity, lastUpdate = null)
{
    var type_name;
    switch (activity.type_name) {
        case "firmware": type_name = "Прошивка"; break;
        case "config": type_name = "Конфигурация"; break;
        case "set": type_name = "Изменение параметров"; break;
        case "getAllParams": type_name = "Получение всех параметров"; break;
        case "reset": type_name = "Сброс"; break;
        case "reboot": type_name = "Перезагрузка"; break;
        case "refresh": type_name = "Connection Request"; break;
        case "addConnection": type_name = "Добавление подключения"; break;
        case "deleteConnection": type_name = "Удаление подключения"; break;
        case "ipPingDiagnostics": type_name = "Ping"; break;
        case "restoreConfig": type_name = "Восстановление настроек"; break;
        case "valueChange": type_name = "Изменение значения"; break;
        case "autoRefresh": type_name = "Автообновление (данных)"; break;
        case "createBridge": type_name = "Создание моста"; break;
        case "createPort": type_name = "Создание порта"; break;
        case "selectInterface": type_name = "Смена интерфейса"; break;
        case "traceRouteDiagnostics": type_name = "Traceroute"; break;
        case "deleteVlan": type_name = "Удаление VLAN"; break;
        case "addVlanPort": type_name = "Добавление VLAN"; break;
        case "deleteVlanPort": type_name = "Удаление порта VLAN"; break;
        case "uploadDiagnostics": type_name = "Диагностика загрузки"; break;
        case "downloadDiagnostics": type_name = "Диагностика скачивания"; break;
        case "schedulerTask": type_name = "Запланированное задание"; break;
        default: type_name = activity.type_name;
    }
    var operation_status;
    switch (activity.operation_status) {
        case 0: operation_status = "В очереди"; break;
        case 1: operation_status = "Выполняется"; break;
        case 2: operation_status = "Завершено"; break;
        case 4: operation_status = "Время ожидания превышено"; break;
        case 5: operation_status = "Время выполнение задачи превышено"; break;
        case 401: operation_status = "Устройство не отвечает"; break;
        case 403: operation_status = "Невозможно авторизоваться"; break;
        case 9000: operation_status = "Метод не поддерживается"; break;
        case 9001: operation_status = "Запрос отклонен"; break;
        case 9002: operation_status = "Неизвестная ошибка"; break;
        case 9003: operation_status = "Неверные аргументы"; break;
        case 9004: operation_status = "Ресурсы превышены"; break;
        case 9005: operation_status = "Неверное имя параметра"; break;
        case 9006: operation_status = "Неверный тип параметра"; break;
        case 9007: operation_status = "Неверное значение параметра"; break;
        case 9008: operation_status = "Попытка установить не перезаписываемый параметр"; break;
        case 9009: operation_status = "Запрос на уведомление отклонен"; break;
        case 9010: operation_status = "Ошибка скачивания"; break;
        case 9011: operation_status = "Ошибка загрузки"; break;
        case 9012: operation_status = "Ошибка аутентификации сервера передачи файлов"; break;
        case 9013: operation_status = "Неподдерживаемый протокол сервера передачи файлов"; break;
        case "default": operation_status = "Ошибка"; break;
        case "null": operation_status = "Некорректное значение id"; break;
        default: operation_status = activity.operation_status;
    }
    var tr_style = null;
    if (!isEmpty(lastUpdate) && lastUpdate <= new Date(activity.create_date)) {
        tr_style = {"class": "bg-success text-white"};
    }
    return makeTableRow(tr_style,
        {data: activity.create_date},
        {data: type_name},
        {data: activity.username},
        {data: operation_status},
    );
}

window.makeAcsActivitesTable = function(activities, lastUpdate = null)
{
    var activities_html;
    var progressTasks = [];
    progressTasks["lastUpdate"] = new Date("1970-01-01 00:00:00");
    var progressTaskTime = null;
    $.each(activities, function(index, activity) {
        activities_html += makeAcsActivitiesRow(activity, lastUpdate);
        if (activity.operation_status < 2) {
            if (activity.type_name === "downloadDiagnostics" || activity.type_name === "uploadDiagnostics") {
                progressTasks["uploadDownload"] = activity.id;
            } else {
                progressTasks[activity.type_name] = activity.id;
            }
            progressTaskTime = new Date(activity.create_date);
        }
        progressTasks["lastUpdate"] = new Date(Math.max.apply(null, [progressTasks["lastUpdate"], new Date(activity.create_date)]));
        progressTasks["lastUpdate"].setSeconds(progressTasks["lastUpdate"].getSeconds() + 1);
    });
    $("#acs_activities").html(activities_html);
    $("#acs_activities .bg-success").hover(function() {
        $(this).removeClass("bg-success text-white");
    });
    if (progressTaskTime !== null) {
        progressTasks["lastUpdate"] = progressTaskTime;
    }
    return progressTasks;
}

window.makeAcsPingsRow = function(ping, lastUpdate = null)
{
    var tr_style = null;
    if (!isEmpty(lastUpdate) && lastUpdate < new Date(ping.create_date)) {
        tr_style = {"class": "bg-success text-white"};
    }
    return makeTableRow(tr_style,
        {data: ping.create_date},
        {data: ping.sent},
        {data: ping.received},
        {data: ping.lost},
        {data: ping.minimum},
        {data: ping.maximum},
        {data: ping.average},
    );
}

window.makeAcsPingsTable = function(pings, lastUpdate = null)
{
    var pings_html;
    var count = 0;
    var lastPingUpdate = new Date("1970-01-01 00:00:00");
    $.each(pings, function(index, ping) {
        if (ping.lost == "NULL") {
            ping.lost = "0";
        }
        if (count < 5) {
            pings_html += makeAcsPingsRow(ping, lastUpdate);
        }
        count++;
        lastPingUpdate = new Date(Math.max.apply(null, [lastPingUpdate, new Date(ping.create_date)]));
    });
    $('#acs_pings_data').html(pings_html);
    $("#acs_pings_data .bg-success").hover(function() {
        $(this).removeClass("bg-success text-white");
    });
    return {
        count: count,
        lastPingUpdate: lastPingUpdate
    };
}

window.makeAcsTracesRow = function(trace, lastUpdate = null)
{
    var tr_style = null;
    if (!isEmpty(lastUpdate) && lastUpdate < new Date(trace.create_date)) {
        tr_style = {"class": "bg-success text-white"};
    }
    return makeTableRow(tr_style,
        {data: trace.create_date},
        {data: trace.response_time},
        {data: trace.hop_rt_times},
        {data: trace.hop_error_code},
        {data: trace.hop_host_address},
        {data: trace.hop_host},
    );
}

window.makeAcsTracesTable = function(traces, lastUpdate = null)
{
    var traces_html;
    var count = 0;
    $.each(traces, function(index, trace) {
        // if (count < 5) {
            traces_html += makeAcsTracesRow(trace, lastUpdate);
        // }
        count++;
    });
    $('#acs_traces_data').html(traces_html);
    return count;
}

window.makeAcsSpeedRow = function(speed, lastUpdate = null)
{
    var tr_style = null;
    if (!isEmpty(lastUpdate) && lastUpdate < new Date(speed.createDate)) {
        tr_style = {"class": "bg-success text-white"};
    }
    return makeTableRow(tr_style,
        {data: speed.createDate},
        {data: speed.type},
        {data: (speed.handshakeRound / 1000000).toFixed(5)},
        {data: (speed.responseTime / 1000000).toFixed(5)},
        {data: (speed.requestRound / 1000000).toFixed(5)},
        {data: speed.responseThroughput.toFixed(5) + " Мбит/c"},
        {data: speed.interfaceThroughput.toFixed(5) + " Мбит/с"},
    );
}

window.makeAcsSpeedTable = function(speeds, lastUpdate = null)
{
    var speeds_html;
    var count = 0;
    var lastSpeedUpdate = new Date("1970-01-01 00:00:00");
    $.each(speeds, function(index, speed) {
        // if (count < 5) {
            speeds_html += makeAcsSpeedRow(speed, lastUpdate);
        // }
        count++;
        lastSpeedUpdate = new Date(Math.max.apply(null, [lastSpeedUpdate, new Date(speed.createDate)]));
    });
    $('#acs_speed_data').html(speeds_html);
    $("#acs_speed_data .bg-success").hover(function() {
        $(this).removeClass("bg-success text-white");
    });
    return {
        count: count,
        lastSpeedUpdate: lastSpeedUpdate,
    };
}

window.makeInetServiceListRow = function(account)
{
    var status;
    switch (account.status) {
        case 0: status = '<i class="fas fa-circle text-success"></i> Активный'; break;
        case 1: status = '<i class="fas fa-circle text-danger"></i> Закрытый'; break;
        case 2: status = '<i class="fas fa-circle text-danger"></i> Заблокированный'; break;
        default: status = '<i class="fas fa-circle text-warning"></i> Неизвестно';
    }
    return makeTableRow(null,
        {data: account.login},
        {data: account.identifier},
        {data: status},
    );
}

window.makeInetServiceListTable = function(inetList)
{
    var inetList_html;
    let warning_level = 0;
    $.each(inetList, function(index, account) {
        inetList_html += makeInetServiceListRow(account);
        if (account.status > 0) {
            warning_level = 2;
        }
    });
    $('#inetServiceListModalBody').html(inetList_html);
    $("#inetServiceListLink").children('img').remove();
    switch (warning_level) {
        case 0: $("#inetServiceListLink").html('<i class="fas fa-circle text-success"></i> ' + $("#inetServiceListLink").html()); break;
        case 2: $("#inetServiceListLink").html('<i class="fas fa-circle text-danger"></i> ' + $("#inetServiceListLink").html()); break;
    }
    return warning_level;
}


window.makeTariffListRow = function(account)
{
    return makeTableRow(null,
        {data: account.dateFrom},
        {data: account.title},
        {data: account.price},
        {data: account.speed},
    );
}

window.makeTariffListTable = function(tariffList)
{
    var tariffList_html;
    $.each(tariffList, function(index, account) {
        tariffList_html += makeTariffListRow(account);

    });
    $('#tariffListModalBody').html(tariffList_html);
    $("#tariffListLink").children('img').remove();
    setField($("#tariffListLink"), tariffList !== null ? tariffList[0]['title'] + $("#tariffListLink").html() : null, true);
}

window.makePhoneNumberListRow = function(account)
{
    return makeTableRow(null,
        {data: account}
    );
}

window.makePhoneNumberListTable = function(phoneList)
{
    var phoneList_html;
    $.each(phoneList, function(index, account) {
        phoneList_html += makePhoneNumberListRow(account);
    });
    $('#billingPhoneNumberListModalBody').html(phoneList_html);
    $("#phoneNumberListLink").children('img').remove();
    $("#phoneNumberListLink").prepend(phoneList[0] || "Отсутствует");

    // if (phoneList[1]) {
    //     $("#phoneNumberListLink").html(phoneList[0] + $("#phoneNumberListLink").html());
    // } else {
    //     $("#phoneNumberListLink").html(phoneList[0]);
    // }
}

window.makeInetSessionsListRow = function(session)
{
    return makeTableRow(null,
        {data: session.username},
        {data: session.ipAddress},
        {data: session.callingStationId},
        {data: session.sessionStart},
        {data: session.connectionStart},
        {data: session.sessionStop || '<i class="fas fa-circle text-success"></i> Сессия активна'},
    );
}

window.makeInetSessionsListTable = function(sessions)
{
    var sessionsList_html;
    var aliveList = sessions.aliveList.sort(function(a, b) {
        return b.sessionStart.toDate("dd.mm.yyyy hh:ii:ss") - a.sessionStart.toDate("dd.mm.yyyy hh:ii:ss");
    });
    var logList = sessions.logList.sort(function(a, b) {
        return b.sessionStop.toDate("dd.mm.yyyy hh:ii:ss") - a.sessionStop.toDate("dd.mm.yyyy hh:ii:ss");
    });
    // logList.sort(function (a,b) {
    //     return (new Date(a.sessionStop).getTime() - new Date(b.sessionStop).getTime()) * -1;
    // });
    $.each(aliveList, function(index, session) {
        sessionsList_html += makeInetSessionsListRow(session);
    });
    $.each(logList, function(index, session) {
        sessionsList_html += makeInetSessionsListRow(session);
    });
    $('#inetSessionListModalBody').html(sessionsList_html);
    $("#inetSessionListModalTitle").children('img').hide();
    $("#inetSessionListRefresh").show();
}

window.makeLocatorMacListRow = function(mac)
{
    return makeTableRow(null,
        {data: mac}
    );
}

window.makeLocatorMacListTable = function(macList, billing_field_mac)
{
    $("#locator_mac").children('img').remove();
    let locator_mac_field = macList.includes(billing_field_mac) ? billing_field_mac + $("#locator_mac").html() : (!isEmpty(macList[0]) ? macList[0] + $("#locator_mac").html() : null);
    let warning_level = 0;
    if (macList.includes(billing_field_mac)) {
        locator_mac_field = '<i class="fas fa-circle text-success"></i> ' + locator_mac_field;
    } else {
        locator_mac_field = '<i class="fas fa-circle text-warning"></i> ' + (locator_mac_field || "?");
        warning_level = 1;
    }
    setField($("#locator_mac"), locator_mac_field, true);
    if (macList.length > 1) {
        var macList_html;
        $.each(macList, function(index, mac) {
            macList_html += makeLocatorMacListRow(mac);
        });
        $('#locatorMacListModalBody').html(macList_html);
        $("#locator_mac").children('span').show();
    }

    return warning_level;

    // if (phoneList[1]) {
    //     $("#phoneNumberListLink").html(phoneList[0] + $("#phoneNumberListLink").html());
    // } else {
    //     $("#phoneNumberListLink").html(phoneList[0]);
    // }
}


$(document).ready(function() {
    $('[data-toggle="popover"]').popover();
    $('.sidebar-collapse').on('click', function (e) {
        e.preventDefault();
        var sidebar = $('#sidebar');
        sidebar.toggleClass('active');
        if (sidebar.hasClass('active')) {
            Cookies.set('sidebar_collapsed', true);
        } else {
            Cookies.set('sidebar_collapsed', false);
        }
    });
    $('[data-toggle="tooltip"]').tooltip();
    $('#billingInfoHeader, #bitrixInfoHeader, #zabbixInfoHeader, #commentsInfoHeader, #ACSInfoHeader').click(function(){
        var name = $(this).attr('id');
        if ($(this).attr('aria-expanded') === "true") {
            Cookies.set(name + '_collapsed', false);
        } else {
            Cookies.set(name + '_collapsed', true);
        }
    });
});
