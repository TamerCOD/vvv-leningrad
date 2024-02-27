// счетчик попаданий
function countRepeats(key) {
    var state = key;
    $.session.repeats = $.session.repeats || {};
    $.session.repeats[state] = $.session.repeats[state] ? $.session.repeats[state] + 1 : 1;
    log(key + " count: " + $.session.repeats[state]);
    return $.session.repeats[state];
}

// счетчик попаданий подряд
function countRepeatsInRow() {
    $.temp.entryState = $.currentState;
    if ($.session.lastEntryState === $.currentState) {
        $.session.repeatsInRow += 1;
    } else {
       $.session.repeatsInRow = 1; // число раз подряд
    }
    log("count in row: " + $.session.repeatsInRow);
    return $.session.repeatsInRow;
}

function counterWithTransition(inRow, limit, key, targetState) {
    if ($.temp.repeat) return;
    var counter = inRow === "true" ? countRepeatsInRow() : countRepeats(key);
    if (counter > limit) {
        $reactions.transition(targetState);
    }
}

function countSessionNumber() {
    $.client.sessionNum = $.client.sessionNum || 0;
    $.client.sessionNum += 1;
}
