function repeatable() {
    $.session.lastRepetableState = $.currentState;
}

function repeat() {
    $.temp.repeat = true;
    var state = $.session.lastRepetableState || $.session.lastState;
    $reactions.transition(state);
}
