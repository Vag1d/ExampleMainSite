require('bootstrap/js/dist/tooltip');
require('bootstrap/js/dist/modal');

$(document).ready(function() {
    $("#help").click(function(e){
        e.preventDefault();
    });
    $("#help").hide();
    const searchConfig = $("#searchConfig").data('config');
    if (searchConfig === undefined) {
        $("#help").show();
        return false;
    } else {
        $("#searchConfig").remove();
    }
    if (searchConfig.consoleGranted) console.log(searchConfig);
    var num_contract = searchConfig.num_contract;
    var report_path = searchConfig.report_path;
    var billingData = searchConfig.billingData;
    loadBilling(searchConfig.ajaxBilling, num_contract, function (data) { // Billing
        if (data.not_found === undefined && data.billing !== undefined && !isEmpty(data.billing.id)) {
            if (searchConfig.consoleGranted) console.log(data.billing);
            $("#help").show();
            $("#abonContent").show();
            $("#abonLoader").hide();
            var warningInfoLevel = 0;
            var warningAcsLevel = 0;
            var warningLocatorLevel = 0;
            var warningBitrixLevel = 0;
            var qoe_loaded = false;
            window.acs_loaded = false;
            var zabbix_loaded = false;
            var active_session_loaded = false;
            var locator_loaded = false;
            var billing_field_mac = "";
            var billing_tbody = $("#billing_tbody");
            var locator_macAddresses = null;
            addField(billing_tbody, "Номер договора", "billing_title", 2, searchConfig.ajaxImage);
            addField(billing_tbody, "Логин", "billing_login", 2, searchConfig.ajaxImage);
            addField(billing_tbody, "ФИО", "billing_comment", 2, searchConfig.ajaxImage);
            addField(billing_tbody, "Окато/Порт", "billing_okato_port", 2, searchConfig.ajaxImage);
            addField(billing_tbody, "Баланс", "billing_balance", 2, searchConfig.ajaxImage);
            addField(billing_tbody, "MAC Адрес", "billing_mac", 2, searchConfig.ajaxImage);
            addField(billing_tbody, "Тариф", "tariffListLink", 2, searchConfig.ajaxImage, '(<a href="#" data-toggle="modal" data-target="#tariffListModal" class="links-helper">подробнее</a>)');
            addField(billing_tbody, "Представитель", "billing_agent", 2, searchConfig.ajaxImage);
            addField(billing_tbody, "Статус договора", "billing_status", 2, searchConfig.ajaxImage);
            addField(billing_tbody, "Учетные записи", "inetServiceListLink", 2, searchConfig.ajaxImage, '<a href="#" data-toggle="modal" data-target="#inetServiceListModal" class="links-helper">Показать</a>');
            addField(billing_tbody, "Статус сессии", "billing_sessions", 2, searchConfig.ajaxImage, '(<a href="#" data-toggle="modal" data-target="#inetSessionListModal" class="links-helper" id="session_helper">подробнее</a>)');
            addField(billing_tbody, "Контактный номер", "phoneNumberListLink", 2, searchConfig.ajaxImage, '(<a href="#" data-toggle="modal" data-target="#phoneNumberListModal" class="links-helper">ещё</a>)');
            addField(billing_tbody, "Средний RTT", "qoe_average_rtt", 2, searchConfig.ajaxImage);
            addField(billing_tbody, "IP", "billing_ip", 2, searchConfig.ajaxImage);
            addField(billing_tbody, "Медианный RTT", "qoe_median_rtt", 2, searchConfig.ajaxImage);
            addField(billing_tbody, "RX-ретрансмиты %", "qoe_rx_retransmissions", 2, searchConfig.ajaxImage);
            addField(billing_tbody, "Количество TCP-сессий", "qoe_tcp_sessions", 2, searchConfig.ajaxImage);
            addField(billing_tbody, "TX-ретрансмиты % (среднее/медианное)", "qoe_tx_retransmissions", 2, searchConfig.ajaxImage);
            addField(billing_tbody, "Количество сессий с RTT более 5 мс", "qoe_long_rtt", 2, searchConfig.ajaxImage);
            addField(billing_tbody, "ACS", "acs_data", 2, searchConfig.ajaxImage);
            addField(billing_tbody, "Карта сети", "zabbix_maps", 2, searchConfig.ajaxImage);
            endTable(billing_tbody);
            let locator_tbody = $("#locator_tbody");
            addField(locator_tbody, "Имя", "locator_device_name", 2, searchConfig.ajaxImage);
            addField(locator_tbody, "MAC", "locator_mac", 2, searchConfig.ajaxImage, '<span style="display: none;">(<a href="#" data-toggle="modal" data-target="#locatorMacListModal" class="links-helper">еще</a>)</span>');
            addField(locator_tbody, "Окато", "locator_okato", 2, searchConfig.ajaxImage);
            addField(locator_tbody, "Производитель", "locator_manufacturer", 2, searchConfig.ajaxImage);
            addField(locator_tbody, "IP", "locator_device_ip", 2, searchConfig.ajaxImage);
            addField(locator_tbody, "Модель", "locator_model", 2, searchConfig.ajaxImage);
            addField(locator_tbody, "Порт", "locator_port", 2, searchConfig.ajaxImage);
            addField(locator_tbody, "Серийный номер", "locator_serial_number", 2, searchConfig.ajaxImage);
            addField(locator_tbody, "Состояние", "locator_state", 2, searchConfig.ajaxImage);
            addField(locator_tbody, "Прошивка", "locator_firmware", 2, searchConfig.ajaxImage);
            addField(locator_tbody, "Скорость", "locator_port_speed", 2, searchConfig.ajaxImage);
            addField(locator_tbody, "Загрузка ЦП", "locator_cpu", 2, searchConfig.ajaxImage);
            addField(locator_tbody, "CRC-in", "locator_crc_in", 2, searchConfig.ajaxImage);
            addField(locator_tbody, "Тип порта", "locator_port_type", 2, searchConfig.ajaxImage);
            addField(locator_tbody, "CRC-out", "locator_crc_out", 2, searchConfig.ajaxImage);
            addField(locator_tbody, "VLAN", "locator_vlan", 2, searchConfig.ajaxImage);
            endTable(locator_tbody);
            $(document).ready(function() {
                setField($('#billing_title'), data.billing.title);
                setField($('#billing_comment'), data.billing.comment);
                var balance = parseFloat(data.billing.balance.replace(",", "."));
                var balance_title = "";
                var balance_text_data = "";
                var balance_limit = parseFloat(data.billing.limit.replace(",", "."));
                if (balance_limit !== 0) {
                    balance_title += "Лимит";
                    balance_text_data += balance_limit;
                }
                if (data.billing.unlockSumm !== null) {
                    if (balance_limit !== 0) {
                        balance_title += "/";
                        balance_text_data += "/";
                    }
                    balance_title += "Сумма для раблокировки";
                    var unlock_sum = parseFloat(data.billing.unlockSumm.replace(",", "."));
                    balance_text_data += unlock_sum;
                }
                color_indicator = "success";
                if (balance <= balance_limit) {
                    color_indicator = "danger";
                    warningInfoLevel = Math.max(warningInfoLevel, 2);
                } else if (balance <= balance_limit + 100.0) {
                    color_indicator = "warning";
                    warningInfoLevel = Math.max(warningInfoLevel, 1);
                }
                var balance_text = '<i class="fas fa-circle text-' + color_indicator + '"></i> ' + balance;
                if (balance_limit !== 0 || data.billing.unlockSumm !== null) {
                    balance_text += " (<span class='edit-tooltip' data-toggle='tooltip' data-html='true' data-placement='top' title='"+balance_title+"' style='text-decoration: underline dashed;'>" + balance_text_data + "</span>)";
                }
                setField($('#billing_balance'), balance_text , true);
                $('#billing_balance .edit-tooltip').tooltip({ boundary: 'window' });
                blockHighlight($('#billingInfoHeader'), warningInfoLevel);
                setField($('#billing_agent'), data.billing.agent);
                var inet_index = 0;
                $.each(data.billing.inetServiceList, function(index, account) {
                    if (account.title.match(/Логин:/) !== null) {
                        inet_index = index;
                    }
                });
                setField($('#billing_login'), data.billing.inetServiceList[inet_index].login);
                var status = "";
                switch (data.billing.status) {
                    case "Активен": status = '<i class="fas fa-circle text-success"></i> Активен'; break;
                    case "Закрыт": status = '<i class="fas fa-circle text-danger"></i> Закрыт'; break;
                    default: status = '<i class="fas fa-circle text-warning"></i> ' + data.billing.status;
                }
                if (!isEmpty(data.billing.statusDate)) {
                    status += " (с " + data.billing.statusDate + ")";
                }
                setField($('#billing_status'), status, true);
                warningInfoLevel = Math.max(makeInetServiceListTable(data.billing.inetServiceList), warningInfoLevel);
                blockHighlight($('#billingInfoHeader'), warningInfoLevel);
                var phoneList = data.billing.phoneList.reverse();
                makePhoneNumberListTable(phoneList);
                $("#billing_phone_add").click(function() {
                    var phoneNumber = $("#billing_phone_input").val();
                    $("#billing_phone_input").removeClass('is-invalid');
                    if (isEmpty(phoneNumber)) {
                        return false;
                    } else if (!phoneNumber.match(/^([78]9\d{9})|(\d{6})$/) || phoneList.includes(phoneNumber)) {
                        $("#billing_phone_input").addClass('is-invalid');
                        return false;
                    }
                    var button = $(this);
                    button.append(' <img src="' + searchConfig.ajaxImage + '">');
                    button.attr('disabled', 'disabled');
                    $("#billing_phone_input").attr('disabled', 'disabled');
                    $('#billingPhoneNumberModalTitle').children('img').show();
                    loadService(searchConfig.ajaxBillingAddPhone, {contractId: data.billing.id, phoneNumber: phoneNumber}, function (data) {
                        if (searchConfig.consoleGranted) console.log(data);
                        button.removeAttr('disabled');
                        button.children('img').remove();
                        $('#billingPhoneNumberModalTitle').children('img').hide();
                        $("#billing_phone_input").removeAttr('disabled').val('');
                        if (data.phoneAdd) {
                            if (phoneNumber.match(/^\d{6}$/)) {
                                phoneNumber = '78722' + phoneNumber;
                            }
                            $("#billingPhoneNumberListModalBody").prepend(makePhoneNumberListRow(phoneNumber));
                            createAlert("Номер успешно добавлен!", 'success').prependTo("#billingPhoneNumberListBlock");
                        } else {
                            createAlert("При добавлении номера произошла ошибка!", 'danger').prependTo("#billingPhoneNumberListBlock");
                        }
                    }, function(jqXHR, exception) {
                        var msg = generateError(report_path, jqXHR, exception, "billing_sessions");
                        $("#billingPhoneNumberModalTitle").children('img').hide();
                        createAlert("<strong>При добавлении номера произошла ошибка в биллинге.</strong> Попробуйте добавить номер позже.", 'danger').prependTo("#billingPhoneNumberListBlock");
                    });
                });
                $('#billingPhoneNumberListModalBody').on('click', '.delete-tooltip', function(e) {
                    e.preventDefault();
                    if (!confirm("Вы уверены?")) {
                        return false;
                    }
                    var delete_button = $(this);
                    delete_button.prop('disabled', true).hide().after(' <img src="' + searchConfig.ajaxImage + '">');
                    loadService(searchConfig.ajaxBillingDeletePhone, {contractId: data.billing.id, phoneNumber: delete_button.data('phone'), "_method" : "DELETE"}, function (data) { // Delete phone number
                        if (searchConfig.consoleGranted) console.log(data);
                        if (data.phoneDelete) {
                            delete_button.parent().parent().html("<td colspan='2'><p class='font-italic text-center mb-0'>Номер удален.</p></td>").delay(5000).fadeOut(200, function() {
                                $(this).remove();
                            });
                        } else {
                            delete_button.prop('disabled', false);
                            delete_button.next().remove();
                            delete_button.show();
                            createAlert("При удалении номера произошла ошибка!", 'danger').prependTo("#billingPhoneNumberListBlock");
                        }
                    });
                });
                makeTariffListTable(data.billing.tariffList);
                var contractId = data.billing.id;
                var serviceListIds = [];
                $.each(data.billing.inetServiceList, function(index, service) {
                    serviceListIds.push(service.id);
                });
                $("#inetSessionListModal").on('show.bs.modal', function(e) {
                    $(this).off();
                    loadService(searchConfig.ajaxBillingSessions, {contractId: contractId, serviceIds: serviceListIds}, function(data) {
                        if (searchConfig.consoleGranted) console.log(data.sessionsList);
                        makeInetSessionsListTable(data.sessionsList);
                    }, function(jqXHR, exception) {
                        var msg = generateError(report_path, jqXHR, exception, "billing_sessions");
                        $("#inetSessionListModalTitle").children('img').hide();
                        $("#inetSessionListRefresh").show();
                        createAlert("<strong>При запросе сессий произошла ошибка.</strong> Попробуйте запросить список сессий позже.", 'danger').prependTo("#inetSessionListModalBlock");
                    });
                    $("#inetSessionListRefresh").click(function(e) {
                        e.preventDefault();
                        $("#inetSessionListModalTitle").children('img').show();
                        $(this).hide();
                        loadService(searchConfig.ajaxBillingSessions, {contractId: contractId, serviceIds: serviceListIds}, function(data) {
                            if (searchConfig.consoleGranted) console.log(data.sessionsList);
                            makeInetSessionsListTable(data.sessionsList);
                        }, function(jqXHR, exception) {
                            var msg = generateError(report_path, jqXHR, exception, "billing_sessions");
                            $("#inetSessionListModalTitle").children('img').hide();
                            $("#inetSessionListRefresh").show();
                            createAlert(msg, 'danger').prependTo("#inetSessionListModalBlock");
                        });
                    });
                });
                loadService(searchConfig.ajaxBillingActiveSession, {contractId: contractId, serviceIds: serviceListIds}, function(data) {
                    active_session_loaded = true;
                    if (qoe_loaded && acs_loaded && zabbix_loaded && active_session_loaded) {
                        $('#billingInfoHeader').children('img').hide();
                    }
                    $("#billing_sessions").children('img').remove();
                    if (searchConfig.consoleGranted) console.log(data);
                    var session_text = "";
                    if (data.activeSession) {
                        session_text = '<i class="fas fa-circle text-success"></i> Сессия активна';
                    } else {
                        session_text = '<i class="fas fa-circle text-danger"></i> Сессия неактивна';
                        warningInfoLevel = Math.max(warningInfoLevel, 2);
                    }
                    $("#billing_sessions").prepend(session_text);
                    billing_field_mac = data.activeSession ? data.activeSession.callingStationId : null;
                    setField($('#billing_mac'), billing_field_mac);
                    if (active_session_loaded && locator_loaded) {
                        warningLocatorLevel = Math.max(warningLocatorLevel, makeLocatorMacListTable(locator_macAddresses, billing_field_mac));
                    }
                    if (billing_field_mac !== null) {
                        loadService(searchConfig.ajaxAcs, {"mac" : billing_field_mac}, function (data) { // ACS
                            $(document).ready(function() {
                                acs_loaded = true;
                                if (qoe_loaded && acs_loaded && zabbix_loaded) {
                                    $('#billingInfoHeader').children('img').hide();
                                }
                                if (acs_loaded && zabbix_loaded && locator_loaded) {
                                    $('#ACSInfoHeader').children('img').hide();
                                }
                                if (searchConfig.consoleGranted) console.log(data);
                                if (!isEmpty(data.acs_info) && data.acs_info.result === undefined) {
                                    var acs_info = data.acs_info;
                                    // setField($("#acs_data"), "<a href='#' onclick='scrollToElement($(\"#acs_info_tab\"), $(\"#ACSInfoHeader\")); return false;'>Есть</a>", true);
                                    setField($("#acs_data"), "<a href='https://192.168.89.77:8080/devInfo/" + acs_info.deviceInfo.device.id + "' target='_blank'>Есть</a>", true);
                                    setField($("#acs_info_model"), [acs_info.deviceInfo.device.name, acs_info.deviceInfo.device.hw_version].join(" | "));
                                    setField($("#acs_info_ip"), acs_info.deviceInfo.device.ip);
                                    setField($("#acs_info_mac"), acs_info.deviceInfo.device.mac);
                                    setField($("#acs_info_port"), acs_info.deviceInfo.device.port);
                                    setField($("#acs_info_serial"), acs_info.deviceInfo.device.serial_number);
                                    setField($("#acs_info_firmware"), acs_info.deviceInfo.device.firmware);
                                    setField($("#acs_info_manufacturer"), acs_info.deviceInfo.device.manufacture);
                                    setField($("#acs_info_clients"), acs_info.deviceInfo.clientCount.count);
                                    setField($("#acs_info_lastConnection"), acs_info.deviceInfo.device.last_inform_time);
                                    setField($("#acs_info_uptime"), acs_info.deviceInfo.device.up_time);
                                    $('#acs_refresh_data').tooltip({
                                        boundary: 'window',
                                        placement: 'top',
                                        trigger: 'hover',
                                    });
                                    $("#acs_cpe_tab").show();
                                    if (acs_info.activities.length > 0) {
                                        var progressTasks = makeAcsActivitesTable(acs_info.activities);
                                    }
                                    var pings = acs_info.ping;
                                    function pingTaskCheck(taskID, deviceID, button, lastUpdate, lastPingUpdate) {
                                        $('#ACSInfoHeader, #acs_cpe_tab, #acs_pings_tab').children('img').show();
                                        button.append(' <img src="' + searchConfig.ajaxImage + '">');
                                        loadService(searchConfig.ajaxAcsTaskCheck, {"taskID": taskID, "type": "ping", "device_id": deviceID}, function (data) {
                                            if (searchConfig.consoleGranted) console.log(data);
                                            button.children('img').remove();
                                            $('#ACSInfoHeader, #acs_cpe_tab, #acs_pings_tab').children('img').hide();
                                            if (data.task_status >= 2) {
                                                button.children(".edit-tooltip").tooltip('dispose').remove();
                                                button.removeAttr('disabled');
                                                $("#acs_ping_address, #acs_ping_packets").removeAttr('disabled');
                                                pingData = makeAcsPingsTable(data.task_result.ping, lastPingUpdate);
                                                progressTasks["ipPingDiagnostics"] = undefined;
                                                let currentTasks = makeAcsActivitesTable(data.task_result.activities, lastUpdate);
                                                let taskInProgress = [];
                                                for (let [type, id] of Object.entries(currentTasks)) {
                                                    if (id !== undefined && type !== "lastUpdate" && type !== "ipPingDiagnostics" && type !== "traceRouteDiagnostics" && type !== "uploadDownload") {
                                                        taskInProgress.id = id;
                                                        taskInProgress.type = type;
                                                        break;
                                                    } else continue;
                                                }
                                                if (progressTasks["traceRouteDiagnostics"] !== undefined) {
                                                    var traceButton = $("#acs_trace_create");
                                                    // TODO: на слуучай, если с блокировкой кнопок и полей что-то пойдет не так
                                                    // traceButton.attr("disabled", "disabled");
                                                    // traceButton.prepend("<span class='edit-tooltip' data-toggle='tooltip' data-html='true' data-placement='top' title='Задача поставлена в очередь и ожидает выполнения.'><i class='fas fa-info'></i></span> ");
                                                    // traceButton.children(".edit-tooltip").tooltip({ boundary: 'window' });
                                                    // $("#acs_ping_address, #acs_ping_packets").attr('disabled', 'disabled');
                                                    setTimeout(traceTaskCheck.bind(null, progressTasks["traceRouteDiagnostics"], deviceID, traceButton, progressTasks["lastUpdate"]), 500);
                                                } else if (progressTasks["uploadDownload"] !== undefined) {
                                                    var speedButton = $("#acs_speed_create");
                                                    setTimeout(speedTaskCheck.bind(null, progressTasks["uploadDownload"], deviceID, speedButton, progressTasks["lastUpdate"], speedData.lastSpeedUpdate), 500);
                                                } else if (progressTasks["ipPingDiagnostics"] !== undefined) {
                                                    button.attr("disabled", "disabled");
                                                    button.prepend("<span class='edit-tooltip' data-toggle='tooltip' data-html='true' data-placement='top' title='Задача поставлена в очередь и ожидает выполнения.'><i class='fas fa-info'></i></span> ");
                                                    button.children(".edit-tooltip").tooltip({ boundary: 'window' });
                                                    $("#acs_ping_address, #acs_ping_packets").attr('disabled', 'disabled');
                                                    setTimeout(pingTaskCheck.bind(null, progressTasks["ipPingDiagnostics"], deviceID, button, progressTasks["lastUpdate"], pingData.lastPingUpdate), 5000);
                                                } else if (taskInProgress.id !== undefined) {
                                                    setTimeout(otherTaskCheck.bind(null, taskInProgress, deviceID, progressTasks["lastUpdate"]), 500);
                                                    progressTasks[taskInProgress.type] = taskInProgress.id;
                                                } else {
                                                    progressTasks = currentTasks;
                                                }
                                            } else {
                                                setTimeout(pingTaskCheck.bind(null, taskID, deviceID, button, lastUpdate, lastPingUpdate), 5000);
                                            }
                                        });
                                    }
                                    var traces = acs_info.traceroute;
                                    function traceTaskCheck(taskID, deviceID, button, lastUpdate) {
                                        $('#ACSInfoHeader, #acs_cpe_tab, #acs_traces_tab').children('img').show();
                                        button.append(' <img src="' + searchConfig.ajaxImage + '">');
                                        loadService(searchConfig.ajaxAcsTaskCheck, {"taskID": taskID, "type": "traceroute", "device_id": deviceID}, function (data) {
                                            if (searchConfig.consoleGranted) console.log(data);
                                            button.children('img').remove();
                                            $('#ACSInfoHeader, #acs_cpe_tab, #acs_traces_tab').children('img').hide();
                                            if (data.task_status >= 2) {
                                                button.children(".edit-tooltip").tooltip('dispose').remove();
                                                button.removeAttr('disabled');
                                                $("#acs_trace_address, #acs_trace_hops").removeAttr('disabled');
                                                makeAcsTracesTable(data.task_result.traceroute.reverse());
                                                progressTasks["traceRouteDiagnostics"] = undefined;
                                                let currentTasks = makeAcsActivitesTable(data.task_result.activities, lastUpdate);
                                                let taskInProgress = [];
                                                for (let [type, id] of Object.entries(currentTasks)) {
                                                    if (id !== undefined && type !== "lastUpdate" && type !== "ipPingDiagnostics" && type !== "traceRouteDiagnostics" && type !== "uploadDownload") {
                                                        taskInProgress.id = id;
                                                        taskInProgress.type = type;
                                                        break;
                                                    } else continue;
                                                }
                                                if (progressTasks["ipPingDiagnostics"] !== undefined) {
                                                    var pingButton = $("#acs_ping_create");
                                                    setTimeout(pingTaskCheck.bind(null, progressTasks["ipPingDiagnostics"], deviceID, pingButton, progressTasks["lastUpdate"],  pingData.lastPingUpdate), 500);
                                                } else if (progressTasks["uploadDownload"] !== undefined) {
                                                    var speedButton = $("#acs_speed_create");
                                                    setTimeout(speedTaskCheck.bind(null, progressTasks["uploadDownload"], deviceID, speedButton, progressTasks["lastUpdate"], speedData.lastSpeedUpdate), 500);
                                                } else if (progressTasks["traceRouteDiagnostics"] !== undefined) {
                                                    button.attr("disabled", "disabled");
                                                    button.prepend("<span class='edit-tooltip' data-toggle='tooltip' data-html='true' data-placement='top' title='Задача поставлена в очередь и ожидает выполнения.'><i class='fas fa-info'></i></span> ");
                                                    button.children(".edit-tooltip").tooltip({ boundary: 'window' });
                                                    $("#acs_ping_address, #acs_ping_packets").attr('disabled', 'disabled');
                                                    setTimeout(traceTaskCheck.bind(null, progressTasks["traceRouteDiagnostics"], deviceID, button, progressTasks["lastUpdate"]), 5000);
                                                } else if (taskInProgress.id !== undefined) {
                                                    setTimeout(otherTaskCheck.bind(null, taskInProgress, deviceID, progressTasks["lastUpdate"]), 500);
                                                    progressTasks[taskInProgress.type] = taskInProgress.id;
                                                } else {
                                                    progressTasks = currentTasks;
                                                }
                                            } else {
                                                setTimeout(traceTaskCheck.bind(null, taskID, deviceID, button, lastUpdate), 5000);
                                            }
                                        });
                                    }
                                    var speeds = acs_info.uploadDownload;
                                    function speedTaskCheck(taskID, deviceID, button, lastUpdate, lastSpeedUpdate) {
                                        $('#ACSInfoHeader, #acs_cpe_tab, #acs_speed_tab').children('img').show();
                                        button.append(' <img src="' + searchConfig.ajaxImage + '">');
                                        loadService(searchConfig.ajaxAcsTaskCheck, {"taskID": taskID, "type": "uploadDownload", "device_id": deviceID}, function (data) {
                                            if (searchConfig.consoleGranted) console.log(data);
                                            button.children('img').remove();
                                            $('#ACSInfoHeader, #acs_cpe_tab, #acs_speed_tab').children('img').hide();
                                            if (data.task_status >= 2) {
                                                button.children(".edit-tooltip").tooltip('dispose').remove();
                                                button.removeAttr('disabled');
                                                $("#acs_diagnostic_type, #acs_upload_size, #acs_upload_address, #acs_download_address").removeAttr('disabled');
                                                makeAcsSpeedTable(data.task_result.uploadDownload, lastSpeedUpdate);
                                                progressTasks["uploadDownload"] = undefined;
                                                let currentTasks = makeAcsActivitesTable(data.task_result.activities, lastUpdate);
                                                let taskInProgress = [];
                                                for (let [type, id] of Object.entries(currentTasks)) {
                                                    if (id !== undefined && type !== "lastUpdate" && type !== "ipPingDiagnostics" && type !== "traceRouteDiagnostics" && type !== "uploadDownload") {
                                                        taskInProgress.id = id;
                                                        taskInProgress.type = type;
                                                        break;
                                                    } else continue;
                                                }
                                                if (progressTasks["ipPingDiagnostics"] !== undefined) {
                                                    var pingButton = $("#acs_ping_create");
                                                    setTimeout(pingTaskCheck.bind(null, progressTasks["ipPingDiagnostics"], deviceID, pingButton, progressTasks["lastUpdate"],  pingData.lastPingUpdate), 500);
                                                } else if (progressTasks["traceRouteDiagnostics"] !== undefined) {
                                                    var traceButton = $("#acs_trace_create");
                                                    setTimeout(traceTaskCheck.bind(null, progressTasks["traceRouteDiagnostics"], deviceID, traceButton, progressTasks["lastUpdate"]), 500);
                                                } else if (progressTasks["uploadDownload"] !== undefined) {
                                                    button.attr("disabled", "disabled");
                                                    button.prepend("<span class='edit-tooltip' data-toggle='tooltip' data-html='true' data-placement='top' title='Задача поставлена в очередь и ожидает выполнения.'><i class='fas fa-info'></i></span> ");
                                                    button.children(".edit-tooltip").tooltip({ boundary: 'window' });
                                                    $("#acs_diagnostic_type, #acs_upload_size, #acs_upload_address, #acs_download_address").attr('disabled', 'disabled');
                                                    setTimeout(speedTaskCheck.bind(null, progressTasks["uploadDownload"], deviceID, button, progressTasks["lastUpdate"], speedData.lastSpeedUpdate), 5000);
                                                } else if (taskInProgress.id !== undefined) {
                                                    setTimeout(otherTaskCheck.bind(null, taskInProgress, deviceID, progressTasks["lastUpdate"]), 500);
                                                    progressTasks[taskInProgress.type] = taskInProgress.id;
                                                } else {
                                                    progressTasks = currentTasks;
                                                }
                                            } else {
                                                setTimeout(speedTaskCheck.bind(null, taskID, deviceID, button, lastUpdate, lastSpeedUpdate), 5000);
                                            }
                                        });
                                    }

                                    function otherTaskCheck(task, deviceID, lastUpdate) {
                                        $('#ACSInfoHeader, #acs_cpe_tab').children('img').show();
                                        loadService(searchConfig.ajaxAcsTaskCheck, {"taskID": task.id, "device_id": deviceID}, function (data) {
                                            if (searchConfig.consoleGranted) console.log(data);
                                            $('#ACSInfoHeader, #acs_cpe_tab').children('img').hide();
                                            if (data.task_status >= 2) {
                                                progressTasks[task.type] = undefined;
                                                let currentTasks = makeAcsActivitesTable(data.task_result.activities, lastUpdate);
                                                let taskInProgress = [];
                                                for (let [type, id] of Object.entries(currentTasks)) {
                                                    if (id !== undefined && type !== "lastUpdate" && type !== "ipPingDiagnostics" && type !== "traceRouteDiagnostics" && type !== "uploadDownload") {
                                                        taskInProgress.id = id;
                                                        taskInProgress.type = type;
                                                        break;
                                                    } else continue;
                                                }
                                                if (task.type === "refresh") {
                                                    loadService(searchConfig.ajaxAcs, {"mac" : billing_field_mac}, function (data) {
                                                        if (searchConfig.consoleGranted) console.log(data);
                                                        if (!isEmpty(data.acs_info) && data.acs_info.result === undefined) {
                                                            acs_info = data.acs_info;
                                                            // Info tab
                                                            // setField($("#acs_data"), "<a href='#' onclick='scrollToElement($(\"#acs_info_tab\"), $(\"#ACSInfoHeader\")); return false;'>Есть</a>", true);
                                                            setField($("#acs_data"), "<a href='https://192.168.89.77:8080/devInfo/" + acs_info.deviceInfo.device.id + "' target='_blank'>Есть</a>", true);
                                                            setField($("#acs_info_model"), [acs_info.deviceInfo.device.name, acs_info.deviceInfo.device.hw_version].join(" | "));
                                                            setField($("#acs_info_ip"), acs_info.deviceInfo.device.ip);
                                                            setField($("#acs_info_mac"), acs_info.deviceInfo.device.mac);
                                                            setField($("#acs_info_port"), acs_info.deviceInfo.device.port);
                                                            setField($("#acs_info_serial"), acs_info.deviceInfo.device.serial_number);
                                                            setField($("#acs_info_firmware"), acs_info.deviceInfo.device.firmware);
                                                            setField($("#acs_info_manufacturer"), acs_info.deviceInfo.device.manufacture);
                                                            setField($("#acs_info_clients"), acs_info.deviceInfo.clientCount.count);
                                                            setField($("#acs_info_lastConnection"), acs_info.deviceInfo.device.last_inform_time);
                                                            setField($("#acs_info_uptime"), acs_info.deviceInfo.device.up_time);
                                                            // Activities table
                                                            if (acs_info.activities.length > 0) {
                                                                progressTasks = makeAcsActivitesTable(acs_info.activities, lastUpdate);
                                                            }
                                                            // Ping, Traceroute and Speed diagnostic tabs
                                                            pings = acs_info.ping;
                                                            traces = acs_info.traceroute;
                                                            speeds = acs_info.uploadDownload;
                                                            pingData = makeAcsPingsTable(pings);
                                                            makeAcsTracesTable(traces.reverse());
                                                            speedData = makeAcsSpeedTable(speeds);
                                                            // Wireless tab
                                                            $("#acs_wireless24GHz, #acs_wireless5GHz, #acs_wireless").hide();
                                                            if (acs_info.wireless24GHz !== null && acs_info.wireless24GHz.length > 0) {
                                                                makeAcsWirelessTable(acs_info.wireless24GHz.sort((a, b) => (b.enable - a.enable)), "#acs_wireless24GHz_data");
                                                                $("#acs_wife24ghz_radio_switch").prop('checked', acs_info.wireless24GHz[0].radio_enabled === 1);
                                                                $("#acs_wireless24GHz").show();
                                                            }
                                                            if (acs_info.wireless5GHz !== null && acs_info.wireless5GHz.length > 0) {
                                                                makeAcsWirelessTable(acs_info.wireless5GHz.sort((a, b) => (b.enable - a.enable)), "#acs_wireless5GHz_data");
                                                                $("#acs_wife5ghz_radio_switch").prop('checked', acs_info.wireless5GHz[0].radio_enabled === 1);
                                                                $("#acs_wireless5GHz").show();
                                                            }
                                                            if (acs_info.wlan !== null && acs_info.wlan.length > 0) {
                                                                makeAcsWirelessTable(acs_info.wlan.sort((a, b) => (b.enable - a.enable)), "#acs_wireless_data");
                                                                $("#acs_wireless").show();
                                                            }
                                                            // Enable all ACS inputs, buttons and links
                                                            $("#acs_cpe_block a, #acs_cpe_block button, #acs_cpe_block input, #acsWirelessSettingsModal a, acsWirelessSettingsModal button, acsWirelessSettingsModal input").prop("disabled", false);
                                                            $("#acs_cpe_block a").attr("href", "#");
                                                        } else {
                                                            $("#acs_data").text("Нет");
                                                        }
                                                    }, function(jqXHR, exception) {
                                                        var msg = generateError(report_path, jqXHR, exception, "acs_refresh_after_task");
                                                        acs_loaded = true;
                                                        setField($("#acs_data"), null);
                                                        if (qoe_loaded && acs_loaded && zabbix_loaded) {
                                                            $('#billingInfoHeader').children('img').hide();
                                                        }
                                                        if (acs_loaded && zabbix_loaded && locator_loaded) {
                                                            $('#ACSInfoHeader').children('img').hide();
                                                        }
                                                        $(document).ready(function() {
                                                            createAlert(msg, 'danger').prependTo("#infoBlock");
                                                        });
                                                    });
                                                } else if (progressTasks["ipPingDiagnostics"] !== undefined) {
                                                    var pingButton = $("#acs_ping_create");
                                                    setTimeout(pingTaskCheck.bind(null, progressTasks["ipPingDiagnostics"], deviceID, pingButton, progressTasks["lastUpdate"],  pingData.lastPingUpdate), 500);
                                                } else if (progressTasks["traceRouteDiagnostics"] !== undefined) {
                                                    var traceButton = $("#acs_trace_create");
                                                    setTimeout(traceTaskCheck.bind(null, progressTasks["traceRouteDiagnostics"], deviceID, traceButton, progressTasks["lastUpdate"]), 500);
                                                } else if (progressTasks["uploadDownload"] !== undefined) {
                                                    var speedButton = $("#acs_speed_create");
                                                    setTimeout(speedTaskCheck.bind(null, progressTasks["uploadDownload"], deviceID, speedButton, progressTasks["lastUpdate"], speedData.lastSpeedUpdate), 500);
                                                } else if (taskInProgress.id !== undefined) {
                                                    setTimeout(otherTaskCheck.bind(null, taskInProgress, deviceID, progressTasks["lastUpdate"]), 500);
                                                    progressTasks[taskInProgress.type] = taskInProgress.id;
                                                } else {
                                                    progressTasks = currentTasks;
                                                }
                                            } else {
                                                setTimeout(otherTaskCheck.bind(null, task, deviceID, lastUpdate), 5000);
                                            }
                                        });
                                    }

                                    var pingData = {
                                        count: 0,
                                        lastPingUpdate: new Date("1970-01-01 00:00:00")
                                    };
                                    if (pings !== null && pings.length > 0) {
                                        pingData = makeAcsPingsTable(pings);
                                        if (pingData.count > 5) {
                                            $('#acs_pings_more').parent().show();
                                        }

                                        // TODO: доработать вывод, когда допилят ACS
                                        // $('#acs_pings_more').click(function(e){
                                        //     e.preventDefault();
                                        //     var more = $(this);
                                        //     if (more.prop('disabled')) {
                                        //         return false;
                                        //     }
                                        //     if (more.attr('showed') === undefined) {
                                        //         more.prop('disabled', true);
                                        //         if (more.attr('offset') === undefined) {
                                        //             more.attr('offset', 0);
                                        //         }
                                        //         more.after(' <img src="' + searchConfig.ajaxImage + '">');
                                        //         $('#ACSInfoHeader, #acs_pings_tab').children('img').show();
                                        //         loadService(searchConfig.ajaxAcsPings, {"num_contract" : num_contract, "offset" : parseInt(more.attr('offset')) + 5}, function (data) { // Load more ping data
                                        //             var pings_html;
                                        //             var pings = $.parseJSON(data.pings);
                                        //             if (searchConfig.consoleGranted) console.log(pings);
                                        //             var count = 0;
                                        //             $.each(pings, function (index, ping) {
                                        //                 if (count < 5) {
                                        //                     pings_html += "<tr><td>" + new Date(ping.createDate.timestamp * 1000).toLocaleString() + "</td><td>" + ping.sent + "</td><td>" + ping.received + "</td><td>" + ping.lost + "</td><td>" + ping.minimum + "</td><td>" + ping.maximum + "</td><td>" + ping.average + "</td></tr>";
                                        //                 } else {
                                        //
                                        //                 }
                                        //                 count++;
                                        //             });
                                        //             $('#acs_pings_data').append(pings_html);
                                        //             more.next().remove();
                                        //             if (count < 5) {
                                        //                 more.text('Скрыть');
                                        //                 more.attr('showed', 'true');
                                        //             } else {
                                        //                 more.attr('offset', parseInt(more.attr('offset')) + 5);
                                        //             }
                                        //             more.prop('disabled', false);
                                        //             $('#ACSInfoHeader, #acs_pings_tab').children('img').hide();
                                        //         }, function(jqXHR, exception) {
                                        //             var msg = generateError(report_path, jqXHR, exception, "acs_pings");
                                        //             $('#ACSInfoHeader, #acs_pings_tab').children('img').hide();
                                        //             more.next().remove();
                                        //             $(document).ready(function() {
                                        //                 createAlert("<strong>При загрузке истории произошла ошибка.</strong> Попробуйте позже.", 'danger').prependTo("#acs_pings_block");
                                        //                 $("#acs_pings_block").prepend("<br>");
                                        //             });
                                        //         });
                                        //     } else if (more.attr('showed') === 'false') {
                                        //         $('#acs_pings_data').children('tr').show();
                                        //         more.text('Скрыть');
                                        //         more.attr('showed', 'true');
                                        //     } else {
                                        //         var count = 0;
                                        //         $('#acs_pings_data').children('tr').each(function(){
                                        //             count++;
                                        //             if (count > 5) {
                                        //                 $(this).hide();
                                        //             }
                                        //         });
                                        //         more.text('Показать еще');
                                        //         more.attr('showed', 'false')
                                        //     }
                                        // });
                                    }

                                    if (progressTasks["ipPingDiagnostics"] !== undefined) {
                                        var pingButton = $("#acs_ping_create");
                                        pingButton.attr("disabled", "disabled");
                                        pingButton.prepend("<span class='edit-tooltip' data-toggle='tooltip' data-html='true' data-placement='top' title='Задача поставлена в очередь и ожидает выполнения.'><i class='fas fa-info'></i></span> ");
                                        pingButton.children(".edit-tooltip").tooltip({ boundary: 'window' });
                                        $("#acs_ping_address, #acs_ping_packets").attr('disabled', 'disabled');
                                        setTimeout(pingTaskCheck.bind(null, progressTasks["ipPingDiagnostics"], acs_info.deviceInfo.device.id, pingButton, progressTasks["lastUpdate"], pingData.lastPingUpdate), 5000);
                                    }

                                    $('#acs_ping_create').click(function (e) {
                                        e.preventDefault();
                                        $("#acs_ping_packets").removeClass('is-invalid');
                                        if ($("#acs_ping_address").val() === undefined || $("#acs_ping_address").val() === null || $("#acs_ping_address").val() === "") {
                                            return false;
                                        } else if (!isEmpty($("#acs_ping_packets").val()) && !$("#acs_ping_packets").val().match(/\d+/)) {
                                            $("#acs_ping_packets").addClass('is-invalid');
                                            return false;
                                        }
                                        var button = $(this);
                                        button.append(' <img src="' + searchConfig.ajaxImage + '">');
                                        button.attr('disabled', 'disabled');
                                        $("#acs_ping_address, #acs_ping_packets").attr('disabled', 'disabled');
                                        $('#ACSInfoHeader, #acs_cpe_tab, #acs_pings_tab').children('img').show();
                                        loadService(searchConfig.ajaxAcsPingTaskCreate, {"device_id": acs_info.deviceInfo.device.id, "address" : $("#acs_ping_address").val(), "repetitions": $("#acs_ping_packets").val() }, function (data) {
                                            if (searchConfig.consoleGranted) console.log(data);
                                            button.prepend("<span class='edit-tooltip' data-toggle='tooltip' data-html='true' data-placement='top' title='Задача поставлена в очередь и ожидает выполнения.'><i class='fas fa-info'></i></span> ");
                                            button.children(".edit-tooltip").tooltip({ boundary: 'window' });
                                            button.children('img').remove();
                                            $('#ACSInfoHeader, #acs_cpe_tab, #acs_pings_tab').children('img').hide();
                                            if (data.task.result === "no response") {
                                                $(document).ready(function() {
                                                    createAlert("<strong>CPE не смог ответить при создании задачи.</strong> Возможно, он перегружен или слишком много задач выполняется одновременно. Попробуйте выполнить действие еще раз через несколько секунд.", 'danger').prependTo("#acs_traces_block");
                                                });
                                            } else {
                                                if (progressTasks["ipPingDiagnostics"] === undefined && progressTasks["traceRouteDiagnostics"] === undefined && progressTasks["uploadDownload"] === undefined) {
                                                    setTimeout(pingTaskCheck.bind(null, data.task.result, acs_info.deviceInfo.device.id, button, progressTasks["lastUpdate"], pingData.lastPingUpdate), 5000);
                                                }
                                                progressTasks["ipPingDiagnostics"] = data.task.result;
                                            }
                                            // var ping = $.parseJSON(data.ping);
                                            // if (searchConfig.consoleGranted) console.log(ping);
                                            // if (ping !== null && ping !== undefined) {
                                            //     var ping_html = "<tr><td>" + new Date(ping.createDate.timestamp * 1000).toLocaleString() + "</td><td>" + ping.sent + "</td><td>" + ping.received + "</td><td>" + ping.lost + "</td><td>" + ping.minimum + "</td><td>" + ping.maximum + "</td><td>" + ping.average + "</td></tr>";
                                            //     $('#acs_pings_data').prepend(ping_html);
                                            //     var offset = 1;
                                            //     if ($("#acs_pings_more").attr('offset') !== undefined) {
                                            //         offset = parseInt($("#acs_pings_more").attr('offset')) + 1;
                                            //     }
                                            //     $("#acs_pings_more").attr('offset', offset);
                                            // }
                                        }, function(jqXHR, exception) {
                                            var msg = generateError(report_path, jqXHR, exception, "acs_pingTaskCreate");
                                            $('#ACSInfoHeader, #acs_cpe_tab, #acs_pings_tab').children('img').hide();
                                            button.children('img').remove();
                                            $(document).ready(function() {
                                                createAlert("<strong>При создании задачи произошла ошибка.</strong> Попробуйте позже.", 'danger').prependTo("#acs_pings_block");
                                            });
                                        })
                                    });

                                    if (traces !== null && traces.length > 0) {
                                        makeAcsTracesTable(traces.reverse());
                                        // TODO: доработать вывод, когда допилят ACS
                                        // if (count > 5) {
                                        //     $('#acs_traces_more').parent().show();
                                        // }
                                        //
                                        // $('#acs_traces_more').click(function(e){
                                        //     e.preventDefault();
                                        //     var more = $(this);
                                        //     if (more.prop('disabled')) {
                                        //         return false;
                                        //     }
                                        //     if (more.attr('showed') === undefined) {
                                        //         more.prop('disabled', true);
                                        //         if (more.attr('offset') === undefined) {
                                        //             more.attr('offset', 0);
                                        //         }
                                        //         more.after(' <img src="' + searchConfig.ajaxImage + '">');
                                        //         $('#ACSInfoHeader, #acs_traces_tab').children('img').show();
                                        //         loadService(searchConfig.ajaxAcsTraceTaskCreate, {"num_contract" : num_contract, "offset" : parseInt(more.attr('offset')) + 5}, function (data) { // Load more trace data
                                        //             var traces_html;
                                        //             var traces = $.parseJSON(data.traces);
                                        //             if (searchConfig.consoleGranted) console.log(traces);
                                        //             var count = 0;
                                        //             $.each(traces, function (index, trace) {
                                        //                 if (count < 5) {
                                        //                     traces_html += "<tr><td>" + new Date(trace.createDate.timestamp * 1000).toLocaleString() + "</td><td>" + trace.responseTime + "</td><td>" + trace.routeHopsNumberOfEntries + "</td><td>" + trace.TraceRouteDiagnostics + "</td></tr>";
                                        //                 } else {
                                        //
                                        //                 }
                                        //                 count++;
                                        //             });
                                        //             $('#acs_traces_data').append(traces_html);
                                        //             more.next().remove();
                                        //             if (count < 5) {
                                        //                 more.text('Скрыть');
                                        //                 more.attr('showed', 'true');
                                        //             } else {
                                        //                 more.attr('offset', parseInt(more.attr('offset')) + 5);
                                        //             }
                                        //             more.prop('disabled', false);
                                        //             $('#ACSInfoHeader, #acs_traces_tab').children('img').hide();
                                        //         }, function(jqXHR, exception) {
                                        //             var msg = generateError(report_path, jqXHR, exception, "acs_traces");
                                        //             $('#ACSInfoHeader, #acs_traces_tab').children('img').hide();
                                        //             more.next().remove();
                                        //             $(document).ready(function() {
                                        //                 createAlert("<strong>При загрузке истории произошла ошибка.</strong> Попробуйте позже.", 'danger').prependTo("#acs_traces_block");
                                        //                 $("#acs_traces_block").prepend("<br>");
                                        //             });
                                        //         });
                                        //     } else if (more.attr('showed') === 'false') {
                                        //         $('#acs_traces_data').children('tr').show();
                                        //         more.text('Скрыть');
                                        //         more.attr('showed', 'true');
                                        //     } else {
                                        //         var count = 0;
                                        //         $('#acs_traces_data').children('tr').each(function(){
                                        //             count++;
                                        //             if (count > 5) {
                                        //                 $(this).hide();
                                        //             }
                                        //         });
                                        //         more.text('Показать еще');
                                        //         more.attr('showed', 'false')
                                        //     }
                                        // });
                                    }

                                    if (progressTasks["traceRouteDiagnostics"] !== undefined) {
                                        var traceButton = $("#acs_trace_create");
                                        traceButton.attr("disabled", "disabled");
                                        traceButton.prepend("<span class='edit-tooltip' data-toggle='tooltip' data-html='true' data-placement='top' title='Задача поставлена в очередь и ожидает выполнения.'><i class='fas fa-info'></i></span> ");
                                        traceButton.children(".edit-tooltip").tooltip({ boundary: 'window' });
                                        $("#acs_trace_address, #acs_trace_hops").attr('disabled', 'disabled');
                                        setTimeout(traceTaskCheck.bind(null, progressTasks["traceRouteDiagnostics"], acs_info.deviceInfo.device.id, traceButton, progressTasks["lastUpdate"]), 5000);
                                    }

                                    $('#acs_trace_create').click(function (e) {
                                        e.preventDefault();
                                        $("#acs_trace_hops").removeClass('is-invalid');
                                        if ($("#acs_trace_address").val() === undefined || $("#acs_trace_address").val() === null || $("#acs_trace_address").val() === "") {
                                            return false;
                                        } else if (!isEmpty($("#acs_ping_packets").val()) && !$("#acs_ping_packets").val().match(/\d+/)) {
                                            $("#acs_trace_hops").addClass('is-invalid');
                                            return false;
                                        }
                                        var button = $(this);
                                        button.append(' <img src="' + searchConfig.ajaxImage + '">');
                                        button.attr('disabled', 'disabled');
                                        $("#acs_trace_address, #acs_trace_hops").attr('disabled', 'disabled');
                                        $('#ACSInfoHeader, #acs_cpe_tab, #acs_traces_tab').children('img').show();
                                        loadService(searchConfig.ajaxAcsTraceTaskCreate,{"device_id": acs_info.deviceInfo.device.id, "address" : $("#acs_trace_address").val(), "hops": $("#acs_ping_packets").val()}, function (data) {
                                            if (searchConfig.consoleGranted) console.log(data);
                                            button.prepend("<span class='edit-tooltip' data-toggle='tooltip' data-html='true' data-placement='top' title='Задача поставлена в очередь и ожидает выполнения.'><i class='fas fa-info'></i></span> ");
                                            button.children(".edit-tooltip").tooltip({ boundary: 'window' });
                                            button.children('img').remove();
                                            $('#ACSInfoHeader, #acs_cpe_tab, #acs_traces_tab').children('img').hide();
                                            if (data.task.result === "no response") {
                                                $(document).ready(function() {
                                                    createAlert("<strong>CPE не смог ответить при создании задачи.</strong> Возможно, он перегружен или слишком много задач выполняется одновременно. Попробуйте выполнить действие еще раз через несколько секунд.", 'danger').prependTo("#acs_traces_block");
                                                });
                                            } else {
                                                if (progressTasks["ipPingDiagnostics"] === undefined && progressTasks["traceRouteDiagnostics"] === undefined && progressTasks["uploadDownload"] === undefined) {
                                                    setTimeout(traceTaskCheck.bind(null, data.task.result, acs_info.deviceInfo.device.id, button, progressTasks["lastUpdate"]), 5000);
                                                }
                                                progressTasks["traceRouteDiagnostics"] = data.task.result;
                                            }
                                        }, function(jqXHR, exception) {
                                            var msg = generateError(report_path, jqXHR, exception, "acs_tracessh");
                                            $('#ACSInfoHeader, #acs_cpe_tab, #acs_traces_tab').children('img').hide();
                                            button.children('img').remove();
                                            $(document).ready(function() {
                                                createAlert("<strong>При создании задачи произошла ошибка.</strong> Попробуйте позже.", 'danger').prependTo("#acs_traces_block");
                                            });
                                        })
                                    });

                                    var speedData = {
                                        count: 0,
                                        lastSpeedUpdate: new Date("1970-01-01 00:00:00")
                                    };

                                    if (speeds !== null && speeds.length > 0) {
                                        speedData = makeAcsSpeedTable(speeds);
                                    }

                                    if (progressTasks["uploadDownload"] !== undefined) {
                                        var speedButton = $("#acs_speed_create");
                                        speedButton.attr("disabled", "disabled");
                                        speedButton.prepend("<span class='edit-tooltip' data-toggle='tooltip' data-html='true' data-placement='top' title='Задача поставлена в очередь и ожидает выполнения.'><i class='fas fa-info'></i></span> ");
                                        speedButton.children(".edit-tooltip").tooltip({ boundary: 'window' });
                                        $("#acs_diagnostic_type, #acs_upload_size, #acs_upload_address, #acs_download_address").attr('disabled', 'disabled');
                                        setTimeout(speedTaskCheck.bind(null, progressTasks["uploadDownload"], acs_info.deviceInfo.device.id, speedButton, progressTasks["lastUpdate"], speedData.lastSpeedUpdate), 5000);
                                    }

                                    $("#acs_diagnostic_type").change(function() {
                                        $("#acs_upload_address, #acs_upload_size, #acs_download_address").parent().hide();
                                        if ($(this).val() === "upload") {
                                            $("#acs_upload_size, #acs_upload_address").parent().show();
                                        } else if ($(this).val() === "download") {
                                            $("#acs_download_address").parent().show();
                                        }
                                        $("#acs_speed_create").show();
                                    });

                                    $('#acs_speed_create').click(function (e) {
                                        $("#acs_upload_size, #acs_upload_address, #acs_download_address").removeClass('is-invalid');
                                        e.preventDefault();
                                        var speed_address;
                                        if ($("#acs_diagnostic_type").val() === "upload") {
                                            if ($("#acs_upload_address").val() === undefined || $("#acs_upload_address").val() === null || $("#acs_upload_address").val() === "") {
                                                $("#acs_upload_address").addClass('is-invalid');
                                                return false;
                                            } else if (isEmpty($("#acs_upload_size").val()) || !$("#acs_ping_packets").val().match(/\d+/)) {
                                                $("#acs_upload_size").addClass('is-invalid');
                                                return false;
                                            }
                                            speed_address = $("#acs_upload_address").val();
                                        } else if ($("#acs_diagnostic_type").val() === "download") {
                                            if ($("#acs_download_address").val() === undefined || $("#acs_download_address").val() === null || $("#acs_download_address").val() === "") {
                                                $("#acs_download_address").addClass('is-invalid');
                                                return false;
                                            }
                                            speed_address = $("#acs_download_address").val();
                                        }
                                        var button = $(this);
                                        button.append(' <img src="' + searchConfig.ajaxImage + '">');
                                        button.attr('disabled', 'disabled');
                                        $("#acs_diagnostic_type, #acs_upload_size, #acs_upload_address, #acs_download_address").attr('disabled', 'disabled');
                                        $('#ACSInfoHeader, #acs_cpe_tab, #acs_speed_tab').children('img').show();
                                        loadService(searchConfig.ajaxAcsSpeedTaskCreate, {"device_id": acs_info.deviceInfo.device.id, "address" : speed_address, "type": $("#acs_diagnostic_type").val(), "size": $("#acs_upload_size").val()}, function (data) {
                                            if (searchConfig.consoleGranted) console.log(data);
                                            button.prepend("<span class='edit-tooltip' data-toggle='tooltip' data-html='true' data-placement='top' title='Задача поставлена в очередь и ожидает выполнения.'><i class='fas fa-info'></i></span> ");
                                            button.children(".edit-tooltip").tooltip({ boundary: 'window' });
                                            button.children('img').remove();
                                            $('#ACSInfoHeader, #acs_cpe_tab, #acs_speed_tab').children('img').hide();
                                            if (data.task.result === "no response") {
                                                $(document).ready(function() {
                                                    createAlert("<strong>CPE не смог ответить при создании задачи.</strong> Возможно, он перегружен или слишком много задач выполняется одновременно. Попробуйте выполнить действие еще раз через несколько секунд.", 'danger').prependTo("#acs_speed_block");
                                                });
                                            } else {
                                                if (progressTasks["ipPingDiagnostics"] === undefined && progressTasks["traceRouteDiagnostics"] === undefined && progressTasks["uploadDownload"] === undefined) {
                                                    setTimeout(speedTaskCheck.bind(null, data.task.result, acs_info.deviceInfo.device.id, button, progressTasks["lastUpdate"], speedData.lastSpeedUpdate), 5000);
                                                }
                                                progressTasks["uploadDownload"] = data.task.result;
                                            }
                                        }, function(jqXHR, exception) {
                                            var msg = generateError(report_path, jqXHR, exception, "acs_tracessh");
                                            $('#ACSInfoHeader, #acs_traces_tab').children('img').hide();
                                            button.children('img').remove();
                                            $(document).ready(function() {
                                                createAlert("<strong>При создании задачи произошла ошибка.</strong> Попробуйте позже.", 'danger').prependTo("#acs_traces_block");
                                            });
                                        });
                                    });

                                    var otherTask = [];
                                    for (let [type, id] of Object.entries(progressTasks)) {
                                        if (id !== undefined && type !== "lastUpdate" && type !== "ipPingDiagnostics" && type !== "traceRouteDiagnostics" && type !== "uploadDownload") {
                                            otherTask.id = id;
                                            otherTask.type = type;
                                            break;
                                        } else continue;
                                    }

                                    if (otherTask.id !== undefined) {
                                        setTimeout(otherTaskCheck.bind(null, otherTask, acs_info.deviceInfo.device.id, progressTasks["lastUpdate"]), 5000);
                                    }

                                    function toggleWirelessFrequency (wifiId, updateButton)
                                    {
                                        if (!confirm("Вы уверены?")) {
                                            updateButton.prop("checked", !updateButton.prop("checked"));
                                            return false;
                                        }
                                        updateButton.parent().after(' <img src="' + searchConfig.ajaxImage + '">');
                                        updateButton.prop('disabled', true);
                                        var wlanIndexes = [];
                                        $('#ACSInfoHeader, #acs_cpe_tab, #acs_wireless_tab').children('img').show();
                                        $(wifiId + " input[data-index]").each(function() {
                                            wlanIndexes.push($(this).data("index"));
                                        });
                                        loadService(searchConfig.ajaxAcsEnableWirelessFrequency, {"device_id": acs_info.deviceInfo.device.id, "wlanIndexes": wlanIndexes, "wlanEnabled": updateButton.prop("checked") ? 1 : 0}, (data) => {
                                            if (searchConfig.consoleGranted) console.log(data);
                                            updateButton.parent().next().remove();
                                            updateButton.prop('disabled', false);
                                            $('#ACSInfoHeader, #acs_cpe_tab, #acs_wireless_tab').children('img').hide();
                                            if (data.taskId === "no response") {
                                                $(document).ready(function() {
                                                    createAlert("<strong>CPE не смог ответить при создании задачи.</strong> Возможно, он перегружен или слишком много задач выполняется одновременно. Попробуйте выполнить действие еще раз через несколько секунд.", 'danger').prependTo(wifiId);
                                                });
                                            } else {
                                                let currentTasks = makeAcsActivitesTable(data.activities, progressTasks["lastUpdate"]);
                                                let currentTask = [];
                                                for (let [type, id] of Object.entries(currentTasks)) {
                                                    if (id == data.taskId) {
                                                        currentTask.id = id;
                                                        currentTask.type = type;
                                                        break;
                                                    } else continue;
                                                }
                                                if (currentTask.id !== undefined) {
                                                    setTimeout(otherTaskCheck.bind(null, currentTask, acs_info.deviceInfo.device.id, progressTasks["lastUpdate"]), 5000);
                                                    progressTasks[currentTask.type] = currentTask.id;
                                                }
                                            }
                                        }, (jqXHR, exception) => {
                                            var msg = generateError(report_path, jqXHR, exception, wifiId.replace("#", "") + "_frequency");
                                            $('#ACSInfoHeader, #acs_cpe_tab, #acs_wireless_tab').children('img').hide();
                                            $("#acsWirelessSettingsModal .modal-body").show();
                                            $(document).ready(function() {
                                                createAlert("<strong>При создании задачи произошла ошибка.</strong> Попробуйте позже.", 'danger').prependTo(wifiId);
                                            });
                                        });
                                    }

                                    if (acs_info.wireless24GHz !== null && acs_info.wireless24GHz.length > 0) {
                                        makeAcsWirelessTable(acs_info.wireless24GHz.sort((a, b) => (b.enable - a.enable)), "#acs_wireless24GHz_data");
                                        $("#acs_wife24ghz_radio_switch").prop('checked', acs_info.wireless24GHz[0].radio_enabled === 1);
                                        $("#acs_wireless24GHz").show();
                                        $("#acs_wife24ghz_radio_switch").change(toggleWirelessFrequency.bind(null, "#acs_wireless24GHz", $(this)));
                                    }
                                    if (acs_info.wireless5GHz !== null && acs_info.wireless5GHz.length > 0) {
                                        makeAcsWirelessTable(acs_info.wireless5GHz.sort((a, b) => (b.enable - a.enable)), "#acs_wireless5GHz_data");
                                        $("#acs_wife5ghz_radio_switch").prop('checked', acs_info.wireless5GHz[0].radio_enabled === 1);
                                        $("#acs_wireless5GHz").show();
                                        $("#acs_wife5ghz_radio_switch").change(toggleWirelessFrequency.bind(null, "#acs_wireless5GHz", $(this)));
                                    }
                                    if (acs_info.wlan !== null && acs_info.wlan.length > 0) {
                                        makeAcsWirelessTable(acs_info.wlan.sort((a, b) => (b.enable - a.enable)), "#acs_wireless_data");
                                        $("#acs_wireless").show();
                                    }
                                    // Wireless Settings
                                    $("#acs_wireless_block").on('click', '.acs_wireless_settings', function() {
                                        if ($(this).prop('disabled')) return false;
                                        $("#ACSInfoHeader, #acs_cpe_tab, #acs_wireless_tab, #acsWirelessSettingsModalTitle").children('img').show();
                                        $("#acsWirelessSettingsModal .modal-body").hide();
                                        loadService(searchConfig.ajaxAcsWirelessSettings, {"device_id": acs_info.deviceInfo.device.id, "wlanId": $(this).parent().parent().data("id")}, (data) => {
                                            if (searchConfig.consoleGranted) console.log(data);
                                            $("#acsWirelessSettingsModal .modal-body").show();
                                            $("#ACSInfoHeader, #acs_cpe_tab, #acs_wireless_tab, #acsWirelessSettingsModalTitle").children('img').hide();
                                            $("#acsWirelessSettingsModalTitle").children('span').text(data.wlaninfo.ssid || "Настройка беспроводной сети");
                                            $("#acs_wireless_bssid").val((data.wlaninfo.bssid !== null) ? data.wlaninfo.bssid.replace(/:/g, "") : "Отсутствует");
                                            $("#acs_wireless_ssid").val(data.wlaninfo.ssid);
                                            $("#acs_wireless_hidessid").prop('checked', !(data.wlaninfo.ssid_hide === 1));
                                            $("#acs_wireless_beacon").prop('checked', (data.wlaninfo.bssid_status === 1));
                                            $("#acs_wireless_valuechange").prop('checked', (data.wlaninfo.value_change === 1));
                                            $("#acs_wireless_wpareneval").val(data.wlaninfo.total_psk_failures);
                                            // Channels
                                            var possibleChannels = {};
                                            if (data.wlaninfo.possible_channels !== "" && data.wlaninfo.possible_channels !== null) {
                                                possibleChannels = data.wlaninfo.possible_channels.split(",");
                                            } else if (data.wlaninfo.frequencyBand === "2.4GHz" || data.wlaninfo.frequencyBand === "") {
                                                possibleChannels = Array.range(1, 13);
                                            } else if (data.wlaninfo.frequencyBand === "5GHz") {
                                                possibleChannels = data.wlan5ghz_ranges;
                                            }
                                            var acs_channel_list = ['<option value="-1"' + (data.wlaninfo.AutoChannelEnable === 1 ? " selected" : "") + ' hidden>' + (data.wlaninfo.AutoChannelEnable === 1 ? data.wlaninfo.channel + ' (auto)' : '') + '</option>', '<option value="0">Авто</option>'];
                                            $.each(possibleChannels, (key, channel) => {
                                                acs_channel_list.push('<option value="' + channel + '"' + (data.wlaninfo.AutoChannelEnable === 0 && data.wlaninfo.channel === channel ? " selected" : "") + '>' + channel + '</option>');
                                            });
                                            $("#acs_wireless_channel").html(acs_channel_list.join(''));
                                            // Wireless modes
                                            var wireless_modes = {};
                                            if (data.wlanModes !== null && data.wlanModes.length > 0) {
                                                wireless_modes = data.wlanModes;
                                            } else {
                                                wireless_modes = {
                                                    "n": "802.11 B/G/N mixed",
                                                    "n-only": "802.11 N",
                                                    "b": "802.11 B",
                                                    "g-only": "802.11 G",
                                                    "g": "802.11 B/G mixed"
                                                };
                                            }
                                            var wireless_modes_list = [];
                                            $.each(wireless_modes, (key, mode) => {
                                                wireless_modes_list.push('<option value="' + key + '"' + (data.wlaninfo.standard === key ? " selected" : "") + '>' + mode + '</option>');
                                            });
                                            $("#acs_wireless_mode").html(wireless_modes_list.join(''));
                                            // TX Power
                                            var tx_powers = [];
                                            if (data.wlaninfo.transmit_power_supported !== "" && data.wlaninfo.transmit_power_supported !== null) {
                                                tx_powers = data.wlaninfo.transmit_power_supported.split(",");
                                                if (!tx_powers.includes("300")) {
                                                    tx_powers.push("300");
                                                }
                                            } else {
                                                tx_powers = [0, 25, 50, 75, 100, 300];
                                            }
                                            var tx_powers_list = [];
                                            $.each(tx_powers, (key, power) => {
                                                tx_powers_list.push('<option value="' + power + '"' + (data.wlaninfo.transmit_power == power ? " selected" : "") + '>' + power + '</option>');
                                            });
                                            $("#acs_wireless_tx").html(tx_powers_list.join(''));
                                            // Max clients
                                            if (data.wlaninfo.max_associated_clients !== null) {
                                                $("#acs_wireless_maxclients").val(data.wlaninfo.max_associated_clients);
                                                $("#acs_wireless_maxclients").parent().parent().show();
                                            } else {
                                                $("#acs_wireless_maxclients").val(0);
                                                $("#acs_wireless_maxclients").parent().parent().hide();
                                            }
                                            // Network auth
                                            var net_auth_types = ["OPEN", "WPA-PSK", "WPA2-PSK", "WPA-PSK/WPA2-PSK mixed"];
                                            var net_auth_types_list = [];
                                            $.each(net_auth_types, (key, auth_type) => {
                                                net_auth_types_list.push('<option value="' + auth_type + '"' + (data.wlaninfo.network_authentication == auth_type ? " selected" : "") + '>' + auth_type + '</option>');
                                            });
                                            $("#acs_wireless_nethauthtype").html(net_auth_types_list.join(''));
                                            // Preshared key
                                            $("#acs_wireless_presharedkey").val("");
                                            // Encryption Type
                                            var encryption_types = {
                                                "AESEncryption": "AES",
                                                "TKIPandAESEncryption": "TKIP+AES"
                                            };
                                            var encryption_types_list = [];
                                            $.each(encryption_types, (encryption_type, encryption_name) => {
                                                encryption_types_list.push('<option value="' + encryption_type + '"' + (data.wlaninfo.wpaEncryptionModes == encryption_type ? " selected" : "") + '>' + encryption_name + '</option>');
                                            });
                                            $("#acs_wireless_encryptiontype").html(encryption_types_list.join(''));
                                            if (data.wlaninfo.network_authentication === "OPEN") {
                                                $("#acs_wireless_presharedkey, #acs_wireless_encryptiontype, #acs_wireless_wpareneval").parent().parent().hide();
                                                $("#acs_wireless_encryptiontype").parent().parent().prev().hide();
                                            } else {
                                                $("#acs_wireless_presharedkey, #acs_wireless_encryptiontype, #acs_wireless_wpareneval").parent().parent().show();
                                                $("#acs_wireless_encryptiontype").parent().parent().prev().show();
                                            }
                                        }, (jqXHR, exception) => {
                                            var msg = generateError(report_path, jqXHR, exception, "acs_wireless_network");
                                            $('#ACSInfoHeader, #acs_cpe_tab, #acs_wireless_tab, #acsWirelessSettingsModalTitle').children('img').hide();
                                            $("#acsWirelessSettingsModal .modal-body").show();
                                            $(document).ready(function() {
                                                createAlert("<strong>При запросе настроек с CPE произошла ошибка.</strong> Попробуйте позже.", 'danger').prependTo("#acsWirelessSettingsModal .modal-body");
                                            });
                                        });
                                    });

                                    // Wireless network Auth type change
                                    $("#acs_wireless_nethauthtype").change(function() {
                                        if ($(this).val() === "OPEN") {
                                            $("#acs_wireless_presharedkey, #acs_wireless_encryptiontype, #acs_wireless_wpareneval").parent().parent().hide();
                                            $("#acs_wireless_encryptiontype").parent().parent().prev().hide();
                                        } else {
                                            $("#acs_wireless_presharedkey, #acs_wireless_encryptiontype, #acs_wireless_wpareneval").parent().parent().show();
                                            $("#acs_wireless_encryptiontype").parent().parent().prev().show();
                                        }
                                    });

                                    // Wireless Network Enable/Disable
                                    $("#acs_wireless_block").on('change', '.acs_wifi_network_enable', function() {
                                        var updateButton = $(this);
                                        if (!confirm("Вы уверены?")) {
                                            updateButton.prop("checked", !$(this).prop("checked"));
                                            return false;
                                        }
                                        updateButton.parent().after(' <img src="' + searchConfig.ajaxImage + '">');
                                        updateButton.prop('disabled', true);
                                        let settingsButton = updateButton.parent().parent().next().children('a');
                                        settingsButton.removeAttr("href").prop('disabled', true);
                                        $('#ACSInfoHeader, #acs_cpe_tab, #acs_wireless_tab').children('img').show();
                                        // ACS Wireless Network
                                        loadService(searchConfig.ajaxAcsEnableWirelessNetwork, {"device_id": acs_info.deviceInfo.device.id, "wlanId": updateButton.parent().parent().parent().data("id"), "wlanIndex": updateButton.data("index"), "wlanEnabled": updateButton.prop("checked") ? 1 : 0}, (data) => {
                                            if (searchConfig.consoleGranted) console.log(data);
                                            updateButton.parent().next().remove();
                                            updateButton.prop('disabled', false);
                                            settingsButton.attr("href", "#").prop('disabled', false);
                                            if (!updateButton.prop("checked")) {
                                                settingsButton.hide();
                                            }
                                            $('#ACSInfoHeader, #acs_cpe_tab, #acs_wireless_tab').children('img').hide();
                                            if (data.taskId === "no response") {
                                                $(document).ready(function() {
                                                    createAlert("<strong>CPE не смог ответить при создании задачи.</strong> Возможно, он перегружен или слишком много задач выполняется одновременно. Попробуйте выполнить действие еще раз через несколько секунд.", 'danger').prependTo("#acs_wireless_block");
                                                });
                                            } else {
                                                let currentTasks = makeAcsActivitesTable(data.activities, progressTasks["lastUpdate"]);
                                                let currentTask = [];
                                                for (let [type, id] of Object.entries(currentTasks)) {
                                                    if (id == data.taskId) {
                                                        currentTask.id = id;
                                                        currentTask.type = type;
                                                        break;
                                                    } else continue;
                                                }
                                                if (currentTask.id !== undefined) {
                                                    setTimeout(otherTaskCheck.bind(null, currentTask, acs_info.deviceInfo.device.id, progressTasks["lastUpdate"]), 5000);
                                                    progressTasks[currentTask.type] = currentTask.id;
                                                }
                                            }
                                        }, (jqXHR, exception) => {
                                            var msg = generateError(report_path, jqXHR, exception, "acs_wireless_enable");
                                            $('#ACSInfoHeader, #acs_cpe_tab, #acs_wireless_tab').children('img').hide();
                                            updateButton.parent().next().remove();
                                            updateButton.prop('disabled', false);
                                            updateButton.parent().parent().next().children('a').attr("href", "#").prop('disabled', false);
                                            $(document).ready(function() {
                                                createAlert("<strong>При создании задачи произошла ошибка.</strong> Попробуйте позже.", 'danger').prependTo("#acs_wireless_block");
                                            });
                                        });
                                    });
                                    // ACS Update (Connection Request)
                                    $("#acs_refresh_data").click(function () {
                                        if (!confirm("Вы уверены? Изменения нельзя будет отменить.")) {
                                            return false;
                                        }
                                        let refreshButton = $(this);
                                        refreshButton.append(' <img src="' + searchConfig.ajaxImage + '">');
                                        refreshButton.prop('disabled', true);
                                        $('#ACSInfoHeader, #acs_cpe_tab').children('img').show();
                                        $("#acs_cpe_block a, #acs_cpe_block button, #acs_cpe_block input, #acsWirelessSettingsModal a, acsWirelessSettingsModal button, acsWirelessSettingsModal input").prop("disabled", true);
                                        $("#acs_cpe_block a").removeAttr("href");
                                        loadService(searchConfig.ajaxAcsRefresh, {"device_id": acs_info.deviceInfo.device.id}, (data) => {
                                            if (searchConfig.consoleGranted) console.log(data);
                                            refreshButton.children('img').remove();
                                            if (data.taskId === "no response") {
                                                $(document).ready(function() {
                                                    createAlert("<strong>CPE не смог ответить при создании задачи.</strong> Возможно, он перегружен или слишком много задач выполняется одновременно. Попробуйте выполнить действие еще раз через несколько секунд.", 'danger').prependTo("#acs_activities_block");
                                                });
                                                $("#acs_cpe_block a, #acs_cpe_block button, #acs_cpe_block input, #acsWirelessSettingsModal a, acsWirelessSettingsModal button, acsWirelessSettingsModal input").prop("disabled", false);
                                                $("#acs_cpe_block a").attr("href", "#");
                                            } else {
                                                let currentTasks = makeAcsActivitesTable(data.activities, progressTasks["lastUpdate"]);
                                                let currentTask = [];
                                                for (let [type, id] of Object.entries(currentTasks)) {
                                                    if (id == data.taskId && type == "refresh") {
                                                        currentTask.id = id;
                                                        currentTask.type = type;
                                                        break;
                                                    } else continue;
                                                }
                                                if (currentTask.id !== undefined) {
                                                    setTimeout(otherTaskCheck.bind(null, currentTask, acs_info.deviceInfo.device.id, progressTasks["lastUpdate"]), 5000);
                                                    progressTasks[currentTask.type] = currentTask.id;
                                                }
                                            }
                                        }, (jqXHR, exception) => {
                                            var msg = generateError(report_path, jqXHR, exception, "acs_wireless_enable");
                                            $('#ACSInfoHeader, #acs_cpe_tab, #acs_wireless_tab').children('img').hide();
                                            updateButton.parent().next().remove();
                                            updateButton.prop('disabled', false);
                                            updateButton.parent().parent().next().children('a').attr("href", "#").prop('disabled', false);
                                            $(document).ready(function() {
                                                createAlert("<strong>При создании задачи произошла ошибка.</strong> Попробуйте позже.", 'danger').prependTo("#acs_activities_block");
                                            });
                                        });
                                    });
                                    // ACS Update Wireless Settings
                                    $("#acs_modal_wireless_save").click(function() {
                                        let refreshButton = $(this);
                                        refreshButton.append(' <img src="' + searchConfig.ajaxImage + '">');
                                        refreshButton.prop('disabled', true);
                                        $('#ACSInfoHeader, #acs_cpe_tab, #acs_wireless_tab, #acsWirelessSettingsModalTitle').children('img').show();
                                    });
                                } else {
                                    $("#acs_data").text("Нет");
                                }
                            });
                        }, function(jqXHR, exception) {
                            var msg = generateError(report_path, jqXHR, exception, "acs");
                            acs_loaded = true;
                            setField($("#acs_data"), null);
                            if (qoe_loaded && acs_loaded && zabbix_loaded) {
                                $('#billingInfoHeader').children('img').hide();
                            }
                            if (acs_loaded && zabbix_loaded && locator_loaded) {
                                $('#ACSInfoHeader').children('img').hide();
                            }
                            $(document).ready(function() {
                                createAlert(msg, 'danger').prependTo("#infoBlock");
                            });
                        });
                    }
                    setField($('#billing_ip'), data.activeSession ? data.activeSession.ipAddress : null);
                    blockHighlight($('#billingInfoHeader'), warningInfoLevel);
                }, function(jqXHR, exception) {
                    var msg = generateError(report_path, jqXHR, exception, "billing_active_session");
                    active_session_loaded = true;
                    if (qoe_loaded && acs_loaded && zabbix_loaded && active_session_loaded) {
                        $('#billingInfoHeader').children('img').hide();
                    }
                    $(document).ready(function() {
                        createAlert(msg, 'danger').prependTo("#infoBlock");
                        setField($("#billing_mac, #billing_ip"), null);
                    });
                });
            });
            num_contract = data.billing.title;
            if (data.billing.inetServiceList !== undefined) {
                for (let service of data.billing.inetServiceList) {
                    if (service.status === 0) {
                        var search_ocato = service.title.match(/(\d{3}\.\d{3}\.\d{3}\.\d{3}):(\d+)/);
                        if (search_ocato === null) {
                            var search_ocato = service.identifier.match(/(\d{3}\.\d{3}\.\d{3}\.\d{3}):(\d+)/);
                        }
                        if (search_ocato !== null) {
                            break;
                        }
                    }
                }

                if (search_ocato !== null) {
                    setField($('#billing_okato_port'), search_ocato[0] + " " + $('#billing_okato_port').html(), true);
                    loadService(searchConfig.ajaxZabbix, {"ocato" : search_ocato[1]}, function (data) { // Zabbix
                        $(document).ready(function() {
                            zabbix_loaded = true;
                            if (qoe_loaded && acs_loaded && zabbix_loaded) {
                                $('#billingInfoHeader').children('img').hide();
                            }
                            if (acs_loaded && zabbix_loaded && locator_loaded) {
                                $('#ACSInfoHeader').children('img').hide();
                            }
                            if (searchConfig.consoleGranted) console.log(data.zabbix);
                            if (data.zabbix.maps.length === 0) {
                                setField($('#zabbix_maps'), null);
                            } else {
                                setField($('#zabbix_maps'), "<a href='http://77.232.161.34/zabbix.php?action=map.view&sysmapid=" + data.zabbix.maps[0].sysmapid + "&search_elementid=" + data.zabbix.maps[0].selementid + "' target='_blank'>" + data.zabbix.maps[0].name + "</a>", true);
                            }
                            if (data.zabbix.items.host_status.lastvalue === "1") {
                                host_status = "Онлайн, задержка " + data.zabbix.items.delay.lastvalue + " мс";
                            } else {
                                host_status = "Оффлайн";
                            }
                            $("#locator_okato").append('(<a href="https://192.168.117.25/DeviceInfo.aspx?DEVIP=' + data.zabbix.interfaces[0].ip + '" target="_blank">Перейти</a>)');
                            $('#billing_okato_port').children('img').remove();
                            setField($('#billing_okato_port'), $('#billing_okato_port').text() + "(" + host_status + ")");
                            $('#zabbix_graph').attr('src', "data:image/png;base64," + data.zabbix.items.host_status.graphdata).parent().attr('href', 'http://77.232.161.34/history.php?action=showgraph&itemids[]=' + data.zabbix.items.host_status.itemid + '&stime=' + data.zabbix.items.host_status.stime + '&period=' + data.zabbix.items.host_status.period);
                            $('#zabbix_graph_tab').children('img').hide();
                            loadService(searchConfig.ajaxLocator, {"ip":  data.zabbix.interfaces[0].ip + "_" + search_ocato[2]}, function (data) { // Locator
                                $(document).ready(function() {
                                    locator_loaded = true;
                                    if (acs_loaded && zabbix_loaded && locator_loaded) {
                                        $('#ACSInfoHeader').children('img').hide();
                                    }
                                    if (searchConfig.consoleGranted) console.log(data.locator);
                                    $('#locator_tab, #locator_okato').children('img').hide();
                                    setField($("#locator_device_name"), data.locator.name);
                                    setField($("#locator_okato"), data.locator.okato + $("#locator_okato").html(), true);
                                    setField($("#locator_device_ip"), data.locator.ip);
                                    setField($("#locator_manufacturer"), data.locator.manufacturer);
                                    setField($("#locator_model"), data.locator.model);
                                    setField($("#locator_serial_number"), data.locator.serial_number);
                                    setField($("#locator_cpu"), data.locator.cpu);
                                    setField($("#locator_uptime"), data.locator.uptime);
                                    setField($("#locator_firmware"), data.locator.firmware);
                                    if (data.locator.ports_info !== null) {
                                        let port = data.locator.ports_info[0];
                                        var port_state;
                                        switch (port.PortState) {
                                            case "1": port_state = '<i class="fas fa-circle text-success"></i> Up'; break;
                                            case "2": port_state = '<i class="fas fa-circle text-danger"></i> Down'; warningLocatorLevel = Math.max(warningLocatorLevel, 2); break;
                                            default: port_state = port.PortState; break;
                                        }
                                        var port_speed;
                                        if (port.PortSpeed.match(/(Half|LinkDown|10\/Full)/i)) {
                                            port_speed = '<i class="fas fa-circle text-danger"></i> ';
                                            warningLocatorLevel = Math.max(warningLocatorLevel, 2);
                                        } else {
                                            port_speed = '<i class="fas fa-circle text-success"></i> ';
                                        }
                                        port_speed += port.PortSpeed;
                                        var crc_in;
                                        if (parseInt(port.PortInError) > 50) {
                                            crc_in = '<i class="fas fa-circle text-danger"></i>';
                                            warningLocatorLevel = Math.max(warningLocatorLevel, 2);
                                        } else if (parseInt(port.PortInError) > 0) {
                                            crc_in = '<i class="fas fa-circle text-warning"></i>';
                                            warningLocatorLevel = Math.max(warningLocatorLevel, 1);
                                        } else {
                                            crc_in = '<i class="fas fa-circle text-success"></i>';
                                        }
                                        crc_in += " " + port.PortInError;
                                        var crc_out;
                                        if (parseInt(port.PortOutError) > 50) {
                                            crc_out = '<i class="fas fa-circle text-danger"></i>';
                                            warningLocatorLevel = Math.max(warningLocatorLevel, 2);
                                        } else if (parseInt(port.PortOutError) > 0) {
                                            crc_out = '<i class="fas fa-circle text-warning"></i>';
                                            warningLocatorLevel = Math.max(warningLocatorLevel, 1);
                                        } else {
                                            crc_out = '<i class="fas fa-circle text-success"></i>';
                                        }
                                        crc_out += " " + port.PortOutError;
                                        var port_type;
                                        if (port.PortType.match(/TRUNK/i)) {
                                            port_type = '<i class="fas fa-circle text-danger"></i> ';
                                            warningLocatorLevel = Math.max(warningLocatorLevel, 2);
                                        }
                                        port_type += port.PortType;
                                        blockHighlight($("#ACSInfoHeader"), warningAcsLevel);
                                        setField($("#locator_port"), port.PortName);
                                        setField($("#locator_state"), port_state, true);
                                        setField($("#locator_port_type"), port.PortType, true);
                                        setField($("#locator_port_speed"), port_speed, true);
                                        setField($("#locator_crc_in"), crc_in, true);
                                        setField($("#locator_crc_out"), crc_out, true);
                                        setField($("#locator_vlan"), port.PortVLAN_ID);
                                        locator_macAddresses = port.MACAddresses;
                                        if (active_session_loaded && locator_loaded) {
                                            warningLocatorLevel = Math.max(warningLocatorLevel, makeLocatorMacListTable(locator_macAddresses, billing_field_mac));
                                        }
                                        blockHighlight($('#locator_tab'), warningLocatorLevel);
                                        warningAcsLevel = Math.max(warningAcsLevel, warningLocatorLevel);
                                        blockHighlight($('#ACSInfoHeader'), warningLocatorLevel);
                                    } else {
                                        setField($("#locator_port, #locator_state, #locator_port_type, #locator_port_speed, #locator_crc_in, #locator_crc_out, #locator_vlan, #locator_mac"), null);
                                    }
                                    // $('#locator_info').html(locator_html);
                                })
                            }, function(jqXHR, exception) {
                                locator_loaded = true;
                                if (acs_loaded && zabbix_loaded && locator_loaded) {
                                    $('#ACSInfoHeader').children('img').hide();
                                }
                                var msg = generateError(report_path, jqXHR, exception, "locator");
                                $('#locator_tab').children('img').hide();
                                $(document).ready(function() {
                                    createAlert(msg, 'danger').prependTo("#locator_block");
                                    $("#locator_block").prepend("<br>");
                                    setField($("#locator_device_name, #locator_okato, #locator_device_ip, #locator_manufacturer, #locator_model, #locator_serial_number, #locator_cpu, #locator_uptime, #locator_firmware, #locator_port, #locator_state, #locator_port_type, #locator_port_speed, #locator_crc_in, #locator_crc_out, #locator_vlan, #locator_data, #locator_mac"), null);
                                });
                            });
                        });
                    }, function(jqXHR, exception) {
                        var msg = generateError(report_path, jqXHR, exception, "zabbix");
                        zabbix_loaded = true;
                        locator_loaded = true;
                        if (qoe_loaded && acs_loaded && zabbix_loaded) {
                            $('#billingInfoHeader').children('img').hide();
                        }
                        if (acs_loaded && zabbix_loaded && locator_loaded) {
                            $('#ACSInfoHeader').children('img').hide();
                        }
                        $('#zabbix_graph_tab').children('img').hide();
                        $('#billing_okato_port').children('img').remove();
                        $('#locator_tab').children('img').hide();
                        $(document).ready(function() {
                            createAlert(msg, 'danger').prependTo("#infoBlock, #zabbix_graph_block, #locator_block");
                            $("#zabbix_graph_block, #locator_block").prepend("<br>");
                            setField($("#zabbix_maps, #locator_device_name, #locator_okato, #locator_device_ip, #locator_manufacturer, #locator_model, #locator_serial_number, #locator_cpu, #locator_uptime, #locator_firmware, #locator_port, #locator_state, #locator_port_type, #locator_port_speed, #locator_crc_in, #locator_crc_out, #locator_vlan, #locator_data, #locator_mac"), null);
                        });
                    });
                } else {
                    $(document).ready(function() {
                        zabbix_loaded = true;
                        locator_loaded = true;
                        if (qoe_loaded && acs_loaded && zabbix_loaded) {
                            $('#billingInfoHeader').children('img').hide();
                        }
                        if (acs_loaded && zabbix_loaded && locator_loaded) {
                            $('#ACSInfoHeader').children('img').hide();
                        }
                        $('#zabbix_graph_tab').children('img').hide();
                        $('#billing_okato_port').children('img').remove();
                        $('#locator_tab').children('img').hide();
                        createAlert("Один из сервисов не вернул информацию по <strong>Окато/Порт</strong>. По этой причине часть данных не может быть загружена.", 'warning').prependTo("#infoBlock, #zabbix_graph_block, #locator_block");
                        $("#zabbix_graph_block, #locator_block").prepend("<br>");
                        setField($("#billing_okato_port, #zabbix_maps, #locator_device_name, #locator_okato, #locator_device_ip, #locator_manufacturer, #locator_model, #locator_serial_number, #locator_cpu, #locator_uptime, #locator_firmware, #locator_port, #locator_state, #locator_port_type, #locator_port_speed, #locator_crc_in, #locator_crc_out, #locator_vlan, #locator_data, #locator_mac"), null);
                    });
                }
            }

            loadService(searchConfig.ajaxQoe, {"num_contract" : num_contract}, function (data) { // QoE
                $(document).ready(function() {
                    qoe_loaded = true;
                    if (qoe_loaded && acs_loaded && zabbix_loaded) {
                        $('#billingInfoHeader').children('img').hide();
                    }
                    if (searchConfig.consoleGranted) console.log(data.qoe);
                    if (!isEmpty(data.qoe)) {
                        setField($('#qoe_tcp_sessions'), data.qoe.total_sessions);
                        var color_indicator = "success";
                        if (parseFloat(data.qoe.median_rtt) > 15) {
                            color_indicator = "danger";
                            warningInfoLevel = Math.max(warningInfoLevel, 2);
                        } else if (parseFloat(data.qoe.median_rtt) > 5) {
                            color_indicator = "warning";
                            warningInfoLevel = Math.max(warningInfoLevel, 1);
                        }
                        setField($('#qoe_median_rtt'), '<i class="fas fa-circle text-' + color_indicator + '"></i> ' + parseFloat(data.qoe.median_rtt).toFixed(3), true);
                        setField($('#qoe_long_rtt'), data.qoe.long_sessions);
                        color_indicator = "success";
                        if (parseFloat(data.qoe.average_rtt) > 15) {
                            color_indicator = "danger";
                            warningInfoLevel = Math.max(warningInfoLevel, 2);
                        } else if (parseFloat(data.qoe.average_rtt) > 5) {
                            color_indicator = "warning";
                            warningInfoLevel = Math.max(warningInfoLevel, 1);
                        }
                        setField($('#qoe_average_rtt'), '<i class="fas fa-circle text-' + color_indicator + '"></i> ' + parseFloat(data.qoe.average_rtt).toFixed(3), true);
                        color_indicator = "success";
                        if (parseFloat(data.qoe.qoe_table_data[0].rx_retr_percent) > 4.) {
                            color_indicator = "danger";
                            warningInfoLevel = Math.max(warningInfoLevel, 2);
                        } else if (parseFloat(data.qoe.qoe_table_data[0].rx_retr_percent) > 2.) {
                            color_indicator = "warning";
                            warningInfoLevel = Math.max(warningInfoLevel, 1);
                        }
                        setField($('#qoe_rx_retransmissions'), '<i class="fas fa-circle text-' + color_indicator + '"></i> ' + parseFloat(data.qoe.qoe_table_data[0].rx_retr_percent).toFixed(3) + "%", true);
                        color_indicator = "success";
                        if (parseFloat(data.qoe.qoe_table_data[0].tx_retr_percent) > 4.) {
                            color_indicator = "danger";
                            warningInfoLevel = Math.max(warningInfoLevel, 2);
                        } else if (parseFloat(data.qoe.qoe_table_data[0].tx_retr_percent) > 2.) {
                            color_indicator = "warning";
                            warningInfoLevel = Math.max(warningInfoLevel, 1);
                        }
                        let tx_text = '<i class="fas fa-circle text-' + color_indicator + '"></i> ' + parseFloat(data.qoe.qoe_table_data[0].tx_retr_percent).toFixed(3) + "% /";
                        color_indicator = "success";
                        if (parseFloat(data.qoe.qoe_table_data[0].tx_retr_quantile) > 4.) {
                            color_indicator = "danger";
                            warningInfoLevel = Math.max(warningInfoLevel, 2);
                        } else if (parseFloat(data.qoe.qoe_table_data[0].tx_retr_quantile) > 2.) {
                            color_indicator = "warning";
                            warningInfoLevel = Math.max(warningInfoLevel, 1);
                        }
                        tx_text += ' <i class="fas fa-circle text-' + color_indicator + '"></i> ' + parseFloat(data.qoe.qoe_table_data[0].tx_retr_quantile).toFixed(3) + "%";
                        setField($('#qoe_tx_retransmissions'), tx_text, true);
                        blockHighlight($('#billingInfoHeader'), warningInfoLevel);
                    } else {
                        createAlert('Часть данных не загружена, потому что один из сервисов не вернул данные.', 'warning').prependTo("#infoBlock");
                        setField($('#qoe_tcp_sessions, #qoe_median_rtt, #qoe_long_rtt, #qoe_average_rtt, #qoe_rx_retransmissions, #qoe_tx_retransmissions'), null);
                    }
                });
            }, function(jqXHR, exception) {
                var msg = generateError(report_path, jqXHR, exception, "qoe");
                qoe_loaded = true;
                if (qoe_loaded && acs_loaded && zabbix_loaded) {
                    $('#billingInfoHeader').children('img').hide();
                }
                $(document).ready(function() {
                    createAlert(msg, 'danger').prependTo("#infoBlock");
                    setField($("#qoe_tcp_sessions, #qoe_median_rtt, #qoe_long_rtt, #qoe_average_rtt, #qoe_rx_retransmissions, #qoe_tx_retransmissions"), null);
                });
            });
            // loadService(searchConfig.ajaxCacti, {"graphid" : 444}, function (data) { // Cacti
            //     $(document).ready(function() {
            //
            //     });
            // });
            // loadService(searchConfig.ajaxBitrixTasks, {"num_contract" : num_contract}, function (data) { // Bitrix
            //     $(document).ready(function() {
            //         if (searchConfig.consoleGranted) console.log(data.bitrix, data.token);
            //         var bitrix_token = data.token;
            //         makeBitrixTable(data.bitrix);
            //         $('#bitrixInfoHeader').children('img').hide();
            //         $('#bitrix_task_create').click(function(e){
            //             e.preventDefault();
            //             var button = $(this);
            //             button.append(' <img src="' + searchConfig.ajaxImage + '">');
            //             button.attr('disabled', 'disabled');
            //             $('#bitrixInfoHeader').children('img').show();
            //             loadService(searchConfig.ajaxBitrixTaskCreate, {"num_contract" : num_contract, "token" : bitrix_token}, function (data) { // Bitrix create task
            //                 if (searchConfig.consoleGranted) console.log(data);
            //                 var task = data.task;
            //                 button.children('img').remove();
            //                 button.removeAttr('disabled');
            //                 $('#bitrixInfoHeader').children('img').hide();
            //                 addBitrixRow(task);
            //             }, function(jqXHR, exception) {
            //                 var msg = generateError(report_path, jqXHR, exception, "bitrix_task_add");
            //                 $('#bitrixInfoHeader').children('img').hide();
            //                 button.children('img').remove();
            //                 $(document).ready(function() {
            //                     createAlert("<strong>При создании задачи произошла ошибка.</strong> Попробуйте перезагрузить страницу и создать задачу еще раз.", 'danger').prependTo("#bitrixBlock");
            //                 });
            //             });
            //         });
            //         $('#bitrix_tasks_more').click(function(e){
            //             e.preventDefault();
            //             var more = $(this);
            //             if (more.attr('showed') === undefined || more.attr('showed') === 'false') {
            //                 $('#bitrix_tasks').children('tr').show();
            //                 more.text('Скрыть');
            //                 more.attr('showed', 'true');
            //             } else {
            //                 var count = 0;
            //                 $('#bitrix_tasks').children('tr').each(function(){
            //                     count++;
            //                     if (count > 3) {
            //                         $(this).hide();
            //                     }
            //                 });
            //                 more.text('Показать еще');
            //                 more.attr('showed', 'false')
            //             }
            //         });
            //     });
            // }, function(jqXHR, exception) {
            //     var msg = generateError(report_path, jqXHR, exception, "bitrix");
            //     $('#bitrixInfoHeader').children('img').hide();
            //     $(document).ready(function() {
            //         $("#bitrixBlock").html('');
            //         createAlert(msg, 'danger').prependTo("#bitrixBlock");
            //     });
            // });
            loadService(searchConfig.ajaxComments, {"num_contract" : num_contract}, function (data) { // Комментарии
                $(document).ready(function() {
                    var comments = $.parseJSON(data.comments);
                    var current_user = $.parseJSON(data.user);
                    var comments_token = data.token;
                    var is_admin = data.is_admin;
                    if (searchConfig.consoleGranted) console.log([comments, current_user, comments_token, is_admin]);
                    makeCommentTable(comments, is_admin);
                    autosize($('#comment'));
                    $('#commentsInfoHeader').children('img').hide();
                    $('#comments_more').click(function(e){
                        e.preventDefault();
                        var more = $(this);
                        if (more.prop('disabled')) {
                            return false;
                        }
                        if (more.attr('showed') === undefined) {
                            more.prop('disabled', true);
                            if (more.attr('offset') === undefined) {
                                more.attr('offset', 0);
                            }
                            more.after(' <img src="' + searchConfig.ajaxImage + '">');
                            $('#commentsInfoHeader').children('img').show();
                            loadService(searchConfig.ajaxComments, {"num_contract" : num_contract, "offset" : parseInt(more.attr('offset')) + 5}, function (data) { // Load more comments
                                var comments = $.parseJSON(data.comments);
                                var current_user = $.parseJSON(data.user);
                                if (searchConfig.consoleGranted) console.log([comments, current_user]);
                                var count = appendCommentTable(comments, is_admin);
                                more.next().remove();
                                if (count < 5) {
                                    more.text('Скрыть');
                                    more.attr('showed', 'true');
                                } else {
                                    more.attr('offset', parseInt(more.attr('offset')) + 5);
                                }
                                more.prop('disabled', false);
                                $('#commentsInfoHeader').children('img').hide();
                            }, function(jqXHR, exception) {
                                var msg = generateError(report_path, jqXHR, exception, "comments_more");
                                $('#commentsInfoHeader').children('img').hide();
                                more.next().remove();
                                more.remove();
                                $(document).ready(function() {
                                    createAlert(msg, 'danger').prependTo("#commentsBlock");
                                });
                            });
                        } else if (more.attr('showed') === 'false') {
                            $('#comments_list').children('tr').show();
                            more.text('Скрыть');
                            more.attr('showed', 'true');
                        } else {
                            var count = 0;
                            $('#comments_list').children('tr').each(function(){
                                count++;
                                if (count > 5) {
                                    $(this).hide();
                                }
                            });
                            more.text('Показать еще');
                            more.attr('showed', 'false')
                        }
                    });

                    $('#comment_send').click(function(){
                        var comment_text = $("#comment").val();
                        if (comment_text !== '') {
                            var comment_button = $(this);
                            comment_button.attr('disabled', 'disabled').append('<img src="' + searchConfig.ajaxImage + '">');
                            $("#comment").attr('disabled', 'disabled');
                            $('#commentsInfoHeader').children('img').show();
                            loadService(searchConfig.ajaxCommentAdd, {"num_contract" : num_contract, "comment" : comment_text, "token" : comments_token}, function (data) { // Add comment
                                comment_button.children('img').remove();
                                comment_button.removeAttr('disabled');
                                $("#comment").val('').removeAttr('disabled');
                                var comment = $.parseJSON(data.comment);
                                var current_user = $.parseJSON(data.user);
                                prependComment(comment, is_admin);
                                var offset = 1;
                                if ($("#comments_more").attr('offset') !== undefined) {
                                    offset = parseInt($("#comments_more").attr('offset')) + 1;
                                }
                                $("#comments_more").attr('offset', offset);
                                $('#commentsInfoHeader').children('img').hide();
                            }, function(jqXHR, exception) {
                                var msg = generateError(report_path, jqXHR, exception, "comment_add");
                                $('#commentsInfoHeader').children('img').hide();
                                comment_button.children('img').remove();
                                $("#comment").val('').removeAttr('disabled');
                                $(document).ready(function() {
                                    createAlert("<strong>При добавлении комментария произошла ошибка.</strong> Попробуйте перезагрузить страницу и добавить комментарий еще раз.", 'danger').prependTo("#commentsBlock");
                                });
                            });
                        }
                    });

                    $('#comments_list').on('click', '.comment_remove', function(e) {
                        e.preventDefault();
                        if (!confirm("Вы уверены?")) {
                            return false;
                        }
                        var delete_button = $(this);
                        delete_button.prop('disabled', true).after(' <img src="' + searchConfig.ajaxImage + '">');
                        loadService(searchConfig.ajaxCommentRemove, {"num_contract" : num_contract, "comment_id" : parseInt(delete_button.parent().parent().attr("comment_id")), "token" : delete_button.parent().parent().attr("token"), "_method" : "DELETE"}, function (data) { // Delete comment
                            if (data.confirm) {
                                delete_button.parent().parent().html("<td colspan='4'><p class='font-italic text-center mb-0'>Комментарий удален.</p></td>").delay(5000).fadeOut(200, function() {
                                    $(this).remove();
                                });
                                var offset = -1;
                                if ($("#comments_more").attr('offset') !== undefined) {
                                    offset = parseInt($("#comments_more").attr('offset')) - 1;
                                }
                                $("#comments_more").attr('offset', offset);
                            } else {
                                delete_button.prop('disabled', false);
                                delete_button.next().remove();
                                if (data.message !== undefined) {
                                    if (searchConfig.consoleGranted) console.log(data.message);
                                    delete_button.after("<p class='font-italic'>Не удалось удалить комментарий. Причина: " + data.message + "</p>").next().delay(5000).fadeOut(200);
                                } else {
                                    delete_button.after("<p class='font-italic'>Не удалось удалить комментарий.</p>").next().delay(5000).fadeOut(200);
                                }
                            }
                        });
                    });

                    $('#comments_list').on('click', '.comment_edit', function(e) {
                        e.preventDefault();
                        var edit_button = $(this);
                        var row = edit_button.parent().parent();
                        row.children('td').hide();
                        row.children('td').last().show();
                        autosize(row.children('td').last().children('div').first().children('textarea'));
                    });

                    $('#comments_list').on('click', '.comment_change_cancel', function(e) {
                        e.preventDefault();
                        var edit_button = $(this);
                        var row = edit_button.parent().parent().parent();
                        row.children('td:last').hide();
                        row.children('td:not(:last)').show();
                        autosize.destroy(row.children('td').last().children('textarea'));
                    });

                    $('#comments_list').on('click', '.comment_change', function(e) {
                        e.preventDefault();
                        var edit_button = $(this);
                        var row = edit_button.parent().parent().parent();
                        edit_button.prop('disabled', true).append(' <img src="' + searchConfig.ajaxImage + '">');
                        $('#commentsInfoHeader').children('img').show();
                        loadService(searchConfig.ajaxCommentEdit, {"num_contract" : num_contract, "comment_id" : parseInt(row.attr("comment_id")), "token" : row.attr("token"), "text" : edit_button.prev().val()}, function (data) {
                            edit_button.prop('disabled', false).children('img').remove();
                            $('#commentsInfoHeader').children('img').hide();
                            if (data.confirm) {
                                var comment = $.parseJSON(data.comment);
                                if (searchConfig.consoleGranted) console.log(comment);
                                updateComment(comment, row, is_admin);
                            } else {
                                if (data.message !== undefined) {
                                    if (searchConfig.consoleGranted) console.log(data.message);
                                    edit_button.after("<p class='font-italic'>Не удалось изменить комментарий. Причина: " + data.message + "</p>").next().delay(5000).fadeOut(200);
                                } else {
                                    edit_button.after("<p class='font-italic'>Не удалось изменить комментарий.</p>").next().delay(5000).fadeOut(200);
                                }
                            }
                        }, function(jqXHR, exception) {
                            var msg = generateError(report_path, jqXHR, exception, "comment_edit");
                            edit_button.children('img').remove();
                            $('#commentsInfoHeader').children('img').hide();
                            $(document).ready(function() {
                                createAlert("<strong>При редактировании комментария произошла ошибка.</strong> Попробуйте сделать это позже.", 'danger').prependTo("#commentsBlock");
                            });
                        });
                    });
                });
            }, function(jqXHR, exception) {
                var msg = generateError(report_path, jqXHR, exception, "comments");
                $('#commentsInfoHeader').children('img').hide();
                $(document).ready(function() {
                    $("#commentsBlock").html('');
                    createAlert(msg, 'danger').prependTo("#commentsBlock");
                });
            });
        }  else {
            $("#abonLoader").hide();
            $("#abonError").show();
            if (data.status === "token_error") {
                createAlert("<strong>Ошибка при авторизации в биллинге!</strong> Попробуйте авторизоваться снова.", 'danger').appendTo("#billingeError");
                $("#billing_auth").show();
            } else {
                createAlert("<strong>Абонент не найден!</strong>").appendTo("#billingeError");
            }
        }
    }, function(jqXHR, exception) {
        $("#abonLoader").hide();
        $("#abonError").show();
        var msg;
        if (jqXHR.status === 0) {
            msg = "<strong>Нет соединения. Проверьте состояние вашей сети.</strong>";
        } else if (jqXHR.status === 404) {
            msg = "<strong>Запрашиваемый сервис не найден.</strong> Администратораторам выслано уведомление. Попробуйте зайти позже.";
        } else if (jqXHR.status === 500) {
            msg = "<strong>При запросе сервиса произошла ошибка на сервере.</strong> Администратораторам выслано уведомление. Попробуйте зайти позже.";
        } else if (exception === 'parsererror') {
            msg = "<strong>Ошибка в аргументах запроса.</strong> Администратораторам выслано уведомление. Попробуйте зайти позже.";
        } else if (exception === 'timeout') {
            msg = "<strong>Превышено время ожидания запроса.</strong> Администратораторам выслано уведомление. Попробуйте перезагрузить страницу, либо зайти позже.";
        } else if (exception === 'abort') {
            msg = "<strong>Загрузка сервиса прервана.</strong> Администратораторам выслано уведомление. Попробуйте перезагрузить страницу, либо зайти позже.";
        } else {
            msg = "<strong>Неизвестная ошибка.</strong> Администратораторам выслано уведомление. Попробуйте зайти позже.";
        }
        reportError(report_path, jqXHR, exception, "billing");
        createAlert(msg, 'danger').appendTo("#billingeError");
    }, billingData);

    $(function(){

    });
});
