function redial(minutes) {
    $dialer.redial({
        startDateTime: new Date(moment().add(minutes, "m").toDate())
    });
}
