bind("preMatch", function() {
    if ($.request.query === "/start" || (!testMode() && $.currentState === "/")) {
        $.temp.targetState = "/Start";
    }
    // заполняем предыдущий стейт для тестов
    if (testMode()) {
        $.session.lastState = $.session.lastState || $.currentState;
    }
});

bind("preProcess", function() {
    $.temp.entryState = $.currentState;
    if ($.intent) {
        log("INTENT: " + getQuestionName());
    }
});

bind("postProcess", function() {
    $.session.lastState = $.currentState;
    $.session.lastEntryState = $.temp.entryState;
    if (phoneChannel()) {
        $analytics.setSessionResult($.temp.callResult);
    }
});

bind("onAnyError", function($context) {
    var message = $context.exception.message;
    if (message.indexOf("intent_with_provided_path_not_found") !== -1) {
        var intent = $.temp.callResult;
        message = "Кажется, вы удалили из базы знаний вопрос" + (intent ? " \"" + intent + "\"" : "");
    }
    log("ERROR: " + message);
    if (phoneChannel()) {
        $analytics.setSessionResult("ERROR");
        addPause();
        hangUp();
    } else {
        $reactions.answer("ERROR: " + message);
    }
});
