$(function(){
    $("#help").remove();
    $("#check_billing_access").click(function(e){
        e.preventDefault();
        let button = $(this);
        button.attr('disabled', 'disabled');
        button.children('img').show();
        let path = button.data('check-target');
        loadService(path, {}, function(data) {
            if (data.access ===  true) {
                button.children('img').hide();
                createAlert("Доступ к биллингу есть!", 'success').appendTo($("#billing_access_info"));
            } else {
                button.children('img').hide();
                createAlert("<strong>Не удалось получить доступ к биллингу.</strong> Попробуйте авторизоваться еще раз.", 'danger').appendTo($("#billing_access_info"));
            }
        }, function(jqXHR, exception) {
            button.children('img').hide();
        });
    });
});
