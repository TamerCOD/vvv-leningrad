function isTransferError() {
    if (getTransferStatus() === "SUCCESS") {
        $reactions.transition("/TransferHandler/HangUp");
    }
}

function transferWithWorkingHours(timeZone, min, max, stateAvailable, stateUnavailable) {
    var nowTime = moment($jsapi.currentTime()).add(timeZone, "h");
    var from = moment(nowTime.format("DD.MM.YY") + " " + min, "DD.MM.YY HH:mm");
    var to = moment(nowTime.format("DD.MM.YY") + " " + max, "DD.MM.YY HH:mm");

    if (nowTime.format("dddd").toLowerCase() === "sunday"
        || nowTime.format("dddd").toLowerCase() === "saturday"
        || nowTime.isSameOrAfter(to)
        || nowTime.isBefore(from)) {
        $reactions.transition(stateUnavailable);
    } else {
            $reactions.transition(stateAvailable);
    }
}

function getTransferReceiverByTopic() {
    $.session.transferReceiver = ($.intent && $.intent.path.split("/")[3]) || $.session.transferReceiver;
    return $.session.transferReceiver;
}

function setTransferReceiverByDefault(value) {
    $.session.transferReceiver = value;
}
