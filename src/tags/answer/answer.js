$reactions.answer = _.wrap($reactions.answer, function(answerFunc, params) {
    var newParams = _.isObject(params) ? copyObject(params) : {value: params};

    var text = newParams.value;
    text = resolveVars(text);

    if (text.startsWith("http") && text.indexOf(".wav") !== -1 && !testMode()) {
        newParams.value = makeCdnLink(text);
        $reactions.audio(newParams);
    } else {
        newParams.value = text;
        answerFunc(newParams);
    }
});

$reactions.pushReply = _.wrap($reactions.pushReply, function(pushFunc, params) {
    if (params.type === "text") {
        $reactions.answer(params.text);
    } else if (params.type === "audio") {
        $reactions.answer(params.audioUrl);
    } else {
        pushFunc(params);
    }
});

function makeCdnLink(fileName) {
    if (fileName.startsWith("http")) return fileName;
    var link = "https://248305.selcdn.ru/demo_bot_static/" + fileName;
    return link;
}

function resolveVars(txt) {
    var text = txt;
    text = resolveInlineDictionary(text);
    text = $reactions.template(text, $jsapi.context());
    text = resolveInlineDictionary(text);
    return text;
}

function addPause(sec) {
    var silenceAudioUrl = "https://248305.selcdn.ru/demo_bot_static/silence1sec_new.wav";

    var pauseLengthInSec = sec || 1;

    if (phoneChannel()) {
        for (var repeat = 1; repeat <= pauseLengthInSec; ++repeat) {
            $reactions.audio(silenceAudioUrl);
        }
    } else if (!testMode()) {
        $reactions.answer("(пауза " + pauseLengthInSec + " сек)");
    }
}

function getFullPath(key) {
    var pathParts = _.filter(key.split("/"), function(part) {
        return !!part;
    });
    switch (pathParts.length) {
        case 1: return "/KnowledgeBase/FAQ.Контент/Root/" + pathParts.join("/");
        case 2: return "/KnowledgeBase/FAQ.Контент/" + pathParts.join("/");
        case 3:
            if (!pathParts[0].startsWith("FAQ.")) {
                pathParts[0] = "FAQ." + pathParts[0];
            }
            return "/KnowledgeBase/" + pathParts.join("/");
        case 4: return "/" + pathParts.join("/");
        default:
            return key;
    }
}

function getAnswer(key) {
    var replies;
    if (key) {
        var path = getFullPath(key);
        log("path " + path);
        $.temp.callResult = getQuestionName(path);
        replies = $faq.getReplies(path);
    } else {
        $.temp.callResult = getQuestionName();
        replies = $faq.getReplies();
    }
    if (!replies || _.isEmpty(replies) || !replies[0]) {
        throw new Error("В Базе знаний нет ответа на вопрос \"" + $.temp.callResult + "\"");
    }
    return replies;
}

// рандомный ответ
function answerRandom(key) {
    var arr = getAnswer(key);
    $reactions.pushReply(selectRandomArg(arr));
}

// ответ по порядку
function answerNext(key) {
    var arr = getAnswer(key);
    // работа с повторами
    var inx;
    $.session.repeatsInfo = $.session.repeatsInfo || {};
    inx = $.session.repeatsInfo[$.currentState];
    inx = inx === undefined ? 0 : inx + 1;
    inx = inx > arr.length - 1 ? 0 : inx;
    $.session.repeatsInfo[$.currentState] = inx;

    $reactions.pushReply(arr[inx]);
}

// ответ в зависимости от попытки
function answerOnAttempt(key) {
    var arr = getAnswer(key);
    var inx = $.client.sessionNum - 1 || 0;
    inx %= arr.length;
    $reactions.pushReply(arr[inx]);
}

function answerAll(key) {
    var arr = copyObject(getAnswer(key));
    if (arr.length === 1) {
        $reactions.pushReply(arr[0]);
    } else {
        $reactions.pushReply(arr.shift());
        arr.forEach(function(ans) {
            $reactions.pushReply(ans);
        });
    }
}

function answer(_mode, key) {
    var mode = _mode.toLowerCase();
    if (mode === "случайно" || mode === "random") {
        answerRandom(key);
    } else if (mode === "по порядку" || mode === "next") {
        answerNext(key);
    } else if (mode === "по номеру сессии" || mode === "by session number") {
        answerOnAttempt(key);
    } else if (mode === "все" || mode === "all") {
        answerAll(key);
    } else {
        throw new Error("Неверный режим в блоке \"Ответ\": " + mode
            + ". Возможные режимы: случайно, по порядку, по номеру сессии, все.\nСтейт: " + $.currentState);
    }
}

function utcGreeting() {
    var currentTime = parseInt(moment($jsapi.timeForZone("Europe/Moscow"), "x").format("HH"));
    if (currentTime < 12 || currentTime > 22) {
        answerRandom("Приветствие/Общее");
    } else if (currentTime < 18) {
        answerRandom("Приветствие/День");
    } else if (currentTime < 22) {
        answerRandom("Приветствие/Вечер");
    }
}
