function hangUp(message, sec) {
    if (phoneChannel() && sec !== 0) {
        addPause(sec);
    }
    $dialer.hangUp(message || "(Бот повесил трубку)");
}

// проверка на телефонный канал
function phoneChannel() {
    return $.request.channelType === "resterisk";
}

// НЕ ВКЛЮЧАЕТ ТЕКУЩИЙ response
function getDialogHistory() {
    var history = $jsapi.chatHistory();
    history = history.replaceAll("BOT\n", "Бот: ");
    history = history.replaceAll("CLIENT\n", "Клиент: ");
    history = history.replaceAll("\n\n", "\n");
    return history;
}

function getQuestionName(_intentPath) {
    var intentPath = _intentPath || $.intent.path;
    return _.last(intentPath.split("/"));
}

function startCallSession(sec) {
    $jsapi.startSession();
    if (phoneChannel() && sec !== 0) {
        addPause(sec);
    }
}

// для проверки любых значений в тестах
function addTestResponse(key, value) {
    if (testMode()) {
        $.response.test = $.response.test || {};
        $.response.test[key] = value;
    }
    log("test reply: " + key + " = " + toPrettyString(value));
}

function getTransferStatus() {
    if (!phoneChannel()) return $.request.data.transferStatus;
    return $dialer.getTransferStatus();
}
