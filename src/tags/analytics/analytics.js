function setCallResult(value) {
    $.temp.callResult = value;
    addTestResponse("CallResult", value);
}

function setScenarioAction(value) {
    $analytics.setScenarioAction(value);
    addTestResponse("ScenarioAction", value);
}

function setAutomationStatus(value) {
    $analytics.setAutomationStatus(value);
    addTestResponse("AutomationStatus", value);
}

function setSessionTopic(value) {
    $analytics.setSessionTopic(value);
    addTestResponse("SessionTopic", value);
}

function setSessionTopicFAQ(value) {
    var faqValue = value || ($.intent && $.intent.path.split("/")[4]);
    $analytics.setSessionTopic(faqValue);
    addTestResponse("SessionTopicFAQ", faqValue);
}

function reportData(column, value) {
    $analytics.setSessionData(column, value);
}
